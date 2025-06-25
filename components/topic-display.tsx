"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"

interface Topic {
  id: string
  title: string
  content: string
  category: "news" | "promotion" | "maintenance" | "announcement"
  priority: "high" | "medium" | "low"
  publishDate: string
  expiryDate?: string
  isActive: boolean
  createdAt: string
}

export function TopicDisplay() {
  const { t } = useLanguage()
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

  // サンプルデータ（実際は卸会社から取得）
  const [topics] = useState<Topic[]>([
    {
      id: "1",
      title: "年末年始の営業について / 연말연시 영업 안내",
      content:
        "12月29日〜1月3日まで休業いたします。ご注文は12月28日までにお願いします。 / 12월 29일~1월 3일까지 휴업합니다. 주문은 12월 28일까지 부탁드립니다.",
      category: "announcement",
      priority: "high",
      publishDate: "2024-12-20",
      expiryDate: "2024-01-05",
      isActive: true,
      createdAt: "2024-12-20T09:00:00Z",
    },
    {
      id: "2",
      title: "新商品のご案内 / 신상품 안내",
      content:
        "冬季限定の新鮮な野菜が入荷しました。特別価格でご提供中です。 / 겨울철 한정 신선한 채소가 입고되었습니다. 특별가격으로 제공 중입니다.",
      category: "news",
      priority: "medium",
      publishDate: "2024-12-15",
      isActive: true,
      createdAt: "2024-12-15T10:00:00Z",
    },
    {
      id: "3",
      title: "年末セール開催中 / 연말 세일 개최중",
      content: "12月中は全商品10%オフ！この機会をお見逃しなく。 / 12월 중 전 상품 10% 할인! 이 기회를 놓치지 마세요.",
      category: "promotion",
      priority: "high",
      publishDate: "2024-12-01",
      expiryDate: "2024-12-31",
      isActive: true,
      createdAt: "2024-12-01T08:00:00Z",
    },
  ])

  const categories = [
    { value: "news", label: "ニュース / 뉴스", color: "bg-blue-100 text-blue-800" },
    { value: "promotion", label: "プロモーション / 프로모션", color: "bg-green-100 text-green-800" },
    { value: "maintenance", label: "メンテナンス / 점검", color: "bg-yellow-100 text-yellow-800" },
    { value: "announcement", label: "お知らせ / 공지사항", color: "bg-purple-100 text-purple-800" },
  ]

  const priorities = [
    { value: "high", label: "重要", color: "bg-red-100 text-red-800" },
    { value: "medium", label: "通常", color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: "参考", color: "bg-gray-100 text-gray-800" },
  ]

  const toggleExpanded = (topicId: string) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId)
    } else {
      newExpanded.add(topicId)
    }
    setExpandedTopics(newExpanded)
  }

  const activeTopics = topics
    .filter((topic) => topic.isActive)
    .filter((topic) => {
      if (topic.expiryDate) {
        return new Date(topic.expiryDate) >= new Date()
      }
      return true
    })
    .sort((a, b) => {
      // 優先度順でソート
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      // 同じ優先度なら日付順
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    })

  if (activeTopics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{t.topics}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            現在表示するトピックはありません / 현재 표시할 토픽이 없습니다
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>{t.topics}</span>
          <Badge variant="secondary">{activeTopics.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTopics.map((topic) => (
          <Card key={topic.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={categories.find((cat) => cat.value === topic.category)?.color}>
                      {categories.find((cat) => cat.value === topic.category)?.label}
                    </Badge>
                    <Badge className={priorities.find((pri) => pri.value === topic.priority)?.color}>
                      {priorities.find((pri) => pri.value === topic.priority)?.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <div className="text-sm text-gray-500 mt-1">
                    {topic.publishDate}
                    {topic.expiryDate && ` - ${topic.expiryDate}`}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toggleExpanded(topic.id)} className="ml-2">
                  {expandedTopics.has(topic.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedTopics.has(topic.id) && (
              <CardContent className="pt-0">
                <div className="text-sm whitespace-pre-line">{topic.content}</div>
              </CardContent>
            )}
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
