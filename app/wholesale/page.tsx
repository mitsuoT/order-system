"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { WholesaleManagement } from "@/components/wholesale-management"
import { OrderManagement } from "@/components/order-management"
import { ProfitAnalysis } from "@/components/profit-analysis"
import { CustomerManagement } from "@/components/customer-management"
import { Package, ClipboardList, TrendingUp, Users, Globe, ArrowLeft } from "lucide-react"

function WholesalePage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "analytics" | "customers">("products")
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
              <h1 className="text-2xl font-bold text-blue-900">{t.wholesaleApp}</h1>
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
            className={`cursor-pointer transition-all ${activeTab === "products" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Package className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.productManagement}</CardTitle>
                <CardDescription>{t.productManagementDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeTab === "orders" ? "ring-2 ring-purple-500 bg-purple-50" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <ClipboardList className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.orderManagement}</CardTitle>
                <CardDescription>{t.orderManagementDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeTab === "analytics" ? "ring-2 ring-green-500 bg-green-50" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.profitAnalysis}</CardTitle>
                <CardDescription>{t.profitAnalysisDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeTab === "customers" ? "ring-2 ring-orange-500 bg-orange-50" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-6 w-6 text-orange-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t.customerManagement}</CardTitle>
                <CardDescription>{t.customerManagementDescription}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === "products" && <WholesaleManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "analytics" && <ProfitAnalysis products={[]} />}
          {activeTab === "customers" && <CustomerManagement />}
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  return (
    <LanguageProvider>
      <WholesalePage />
    </LanguageProvider>
  )
}
