"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { Building2, Store, Globe } from "lucide-react"

function HomePage() {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.selectUserType}</h2>
          <p className="text-xl text-gray-600">{t.selectUserTypeDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
            onClick={() => (window.location.href = "/wholesale")}
          >
            <CardHeader className="text-center p-8">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl mb-2">{t.wholesaleApp}</CardTitle>
              <CardDescription className="text-lg">{t.wholesaleAppDescription}</CardDescription>
              <div className="mt-4">
                <Button className="w-full" size="lg">
                  {t.enterWholesaleApp}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
            onClick={() => (window.location.href = "/restaurant")}
          >
            <CardHeader className="text-center p-8">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
                <Store className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl mb-2">{t.restaurantApp}</CardTitle>
              <CardDescription className="text-lg">{t.restaurantAppDescription}</CardDescription>
              <div className="mt-4">
                <Button className="w-full" size="lg" variant="outline">
                  {t.enterRestaurantApp}
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.systemFeatures}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">{t.wholesaleFeatures}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• {t.productManagement}</li>
                  <li>• {t.inventoryManagement}</li>
                  <li>• {t.orderManagement}</li>
                  <li>• {t.pcaIntegration}</li>
                  <li>• {t.profitAnalysis}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">{t.restaurantFeatures}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• {t.productCatalog}</li>
                  <li>• {t.easyOrdering}</li>
                  <li>• {t.orderHistory}</li>
                  <li>• {t.realTimeInventory}</li>
                  <li>• {t.multiLanguageSupport}</li>
                </ul>
              </div>
            </div>
          </div>
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
