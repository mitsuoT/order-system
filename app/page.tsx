"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { WholesaleManagement } from "@/components/wholesale-management"
import { RestaurantOrdering } from "@/components/restaurant-ordering"
import { OrderManagement } from "@/components/order-management"
import { Building2, Store, ClipboardList, Globe } from "lucide-react"

function HomePage() {
  const [activeTab, setActiveTab] = useState<"wholesale" | "restaurant" | "orders">("wholesale")
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">{t.systemTitle}</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all ${activeTab === "wholesale" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setActiveTab("wholesale")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.wholesaleManagement}</CardTitle>
                <CardDescription>{t.wholesaleDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeTab === "restaurant" ? "ring-2 ring-green-500" : ""}`}
            onClick={() => setActiveTab("restaurant")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Store className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.restaurantOrdering}</CardTitle>
                <CardDescription>{t.restaurantDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeTab === "orders" ? "ring-2 ring-purple-500" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <ClipboardList className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.orderManagement}</CardTitle>
                <CardDescription>{t.orderDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === "wholesale" && <WholesaleManagement />}
          {activeTab === "restaurant" && <RestaurantOrdering />}
          {activeTab === "orders" && <OrderManagement />}
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  return (
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  )
}
