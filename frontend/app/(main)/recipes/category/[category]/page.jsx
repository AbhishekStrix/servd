"use client"
import { getMealsByArea, getMealsByCategory } from "@/actions/mealdb.actions";
import RecipeGrid from "@/components/RecipeGrid";
import { useParams } from "next/navigation";

export default function CategoryRecipiePage(){
    const params= useParams();
    const category= params.category;

    return(
        <RecipeGrid
        type="category"
        value={category}
        fetchAction={getMealsByCategory}
        backlink="/dashboard"
        />
    )

}