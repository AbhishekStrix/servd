import { auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
  (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/admin\/?$/, '');
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("❌ checkUser: No auth session found from @clerk/nextjs/server currentUser()");
    return { success: false, message: "No auth session" };
  }

  if (!STRAPI_API_TOKEN) {
    console.error("❌ checkUser: STRAPI_API_TOKEN is entirely missing in environment variables!");
    return null;
  }

  // Check if user has Pro plan
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  try {
    // Check if user exists in Strapi
    const existingUserResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.text();
      console.error("❌ checkUser: Strapi /api/users fetch failed!", errorText, "URL:", `${STRAPI_URL}/api/users`);
      return null;
    }

    const existingUserData = await existingUserResponse.json();

    if (existingUserData.length > 0) {
      const existingUser = existingUserData[0];

      // Update subscription tier if changed
      if (existingUser.subscriptionTier !== subscriptionTier) {
        await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ subscriptionTier }),
        });
      }

      return { ...existingUser, subscriptionTier };
    }

    // Get authenticated role
    const rolesResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );

    const rolesData = await rolesResponse.json();
    const authenticatedRole = rolesData.roles.find(
      (role) => role.type === "authenticated"
    );

    if (!authenticatedRole) {
      console.error("❌ checkUser: 'authenticated' role not found in Strapi roles list!", rolesData);
      return null;
    }

    // Create new user
    const userData = {
      username:
        user.username || user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      password: `clerk_managed_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: false,
      role: authenticatedRole.id,
      clerkId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      imageUrl: user.imageUrl || "",
      subscriptionTier,
    };

    const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(userData),
    });

    if (!newUserResponse.ok) {
      const errorText = await newUserResponse.text();
      console.error("❌ checkUser: Error silently creating user in Strapi:", errorText);
      return null;
    }

    const newUser = await newUserResponse.json();
    return newUser;

  } catch (error) {
    console.error("❌ checkUser: Caught exception during checkUser execution:", error);
    return null;
  }
};