"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Store, MessageSquare, Package, FileText, Settings } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProductSearch } from "@/components/product-search"
import { TopicDisplay } from "@/components/topic-display"
import { TopicManagement } from "@/components/topic-management"
import { OrderManagement } from "@/components/order-management"

type Language = "ja" | "ko" | "en"

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ja")
  const [activeTab, setActiveTab] = useState("wholesale")

  const texts = {
    ja: {
      title: "日韓食品流通システム",
      subtitle: "卸売・飲食店向け統合管理システム",
      wholesale: "卸会社向け",
      restaurant: "飲食店向け",
      orderManagement: "受注管理",
      topicManagement: "トピック管理",
      productSearch: "商品検索",
      topicDisplay: "お知らせ",
      features: {
        autoOrderNumber: "受注番号自動採番",
        topicRegistration: "トピック情報登録",
        csvExport: "PCA形式CSV連携",
        productSearch: "商品検索機能",
        topicDisplay: "トピック表示機能",
        multiLanguage: "日韓多言語対応",
      },
    },
    ko: {
      title: "한일 식품 유통 시스템",
      subtitle: "도매・음식점 통합 관리 시스템",
      wholesale: "도매업체용",
      restaurant: "음식점용",
      orderManagement: "수주 관리",
      topicManagement: "토픽 관리",
      productSearch: "상품 검색",
      topicDisplay: "공지사항",
      features: {
        autoOrderNumber: "수주번호 자동채번",
        topicRegistration: "토픽 정보 등록",
        csvExport: "PCA형식 CSV 연계",
        productSearch: "상품 검색 기능",
        topicDisplay: "토픽 표시 기능",
        multiLanguage: "한일 다국어 지원",
      },
    },
    en: {
      title: "Japan-Korea Food Distribution System",
      subtitle: "Integrated Management System for Wholesale & Restaurants",
      wholesale: "For Wholesale",
      restaurant: "For Restaurant",
      orderManagement: "Order Management",
      topicManagement: "Topic Management",
      productSearch: "Product Search",
      topicDisplay: "Announcements",
      features: {
        autoOrderNumber: "Auto Order Numbering",
        topicRegistration: "Topic Information Registration",
        csvExport: "PCA Format CSV Integration",
        productSearch: "Product Search Function",
        topicDisplay: "Topic Display Function",
        multiLanguage: "Japanese-Korean Multi-language Support",
      },
    },
  }

  const t = texts[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600 mt-2">{t.subtitle}</p>
          </div>
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(t.features).map(([key, feature]) => (
            <Card key={key} className="text-center">
              <CardContent className="p-4">
                <div className="text-sm font-medium">{feature}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wholesale" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t.wholesale}
            </TabsTrigger>
            <TabsTrigger value="restaurant" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              {t.restaurant}
            </TabsTrigger>
          </TabsList>

          {/* Wholesale Tab */}
          <TabsContent value="wholesale" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {t.wholesale}
                    <Badge variant="outline">卸会社機能</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="orders" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="orders" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t.orderManagement}
                      </TabsTrigger>
                      <TabsTrigger value="topics" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {t.topicManagement}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                      <OrderManagement language={language} />
                    </TabsContent>

                    <TabsContent value="topics">
                      <TopicManagement language={language} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Restaurant Tab */}
          <TabsContent value="restaurant" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    {t.restaurant}
                    <Badge variant="outline">飲食店機能</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="search" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="search" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {t.productSearch}
                      </TabsTrigger>
                      <TabsTrigger value="announcements" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {t.topicDisplay}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="search">
                      <ProductSearch language={language} />
                    </TabsContent>

                    <TabsContent value="announcements">
                      <TopicDisplay language={language} targetAudience="restaurant" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>日韓食品流通システム - PCA商魂・商管シリーズ対応</p>
          <p>Japanese-Korean Food Distribution System - PCA Compatible</p>
        </div>
      </div>
    </div>
  )
}
