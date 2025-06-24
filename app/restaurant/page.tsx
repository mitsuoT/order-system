"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { RestaurantOrdering } from "@/components/restaurant-ordering"
import { RestaurantOrderHistory } from "@/components/restaurant-order-history"
import { ShoppingCart, History, Globe, ArrowLeft } from "lucide-react"

function RestaurantPage() {
  const [activeTab, setActiveTab] = useState<"ordering" | "history">("ordering")
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t.backToHome}</span>
              </Button>
              <h1 className="text-2xl font-bold text-green-900">{t.restaurantApp}</h1>
              <Badge variant="secondary">{t.version}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "ja" ? "ko" : "ja")}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>{language === "ja" ? "한국어" : "日本語"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all ${activeTab === "ordering" ? "ring-2 ring-green-500 bg-green-50" : ""}`}
            onClick={() => setActiveTab("ordering")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.productOrdering}</CardTitle>
                <CardDescription>{t.productOrderingDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeTab === "history" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <History className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.orderHistory}</CardTitle>
                <CardDescription>{t.orderHistoryDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === "ordering" && <RestaurantOrdering />}
          {activeTab === "history" && <RestaurantOrderHistory />}
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  return (
    <LanguageProvider>
      <RestaurantPage />
    </LanguageProvider>
  )
}
