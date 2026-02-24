"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { RecipePDF } from "./RecipePDF";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadPDFButton({ recipe }) {
    if (!recipe) return null;

    return (
        <PDFDownloadLink
            document={<RecipePDF recipe={recipe} />}
            fileName={`${recipe.title.replace(/\s+/g, "-").toLowerCase()}.pdf`}
        >
            {({ loading }) => (
                <Button
                    variant="outline"
                    className="border-2 border-orange-600 text-orange-700 hover:bg-orange-50 gap-2"
                    disabled={loading}
                >
                    <Download className="w-4 h-4" />
                    {loading ? "Preparing PDF..." : "Download PDF"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
