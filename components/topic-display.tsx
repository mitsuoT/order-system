"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Star, Calendar } from "lucide-react"
import { supabase, isDemo, type Topic } from "@/lib/database"

interface TopicDisplayProps {
  language: "ja" | "ko" | "en"
  targetAudience: "wholesale" | "restaurant" | "both"
}

// Demo data for when Supabase is not configured
const demoTopics: Topic[] = [
  {
    id: "1",
    title: "New Product Launch",
    title_jp: "新商品発売",
    title_kr: "신제품 출시",
    content: "We are excited to announce our new premium rice product.",
    content_jp: "高級米の新商品を発売いたします。",
    content_kr: "프리미엄 쌀 신제품을 출시합니다.",
    category: "product",
    priority: 1,
    is_active: true,
    target_audience: "both",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Seasonal Menu Update",
    title_jp: "季節メニュー更新",
    title_kr: "계절 메뉴 업데이트",
    content: "Spring seasonal menu items are now available.",
    content_jp: "春の季節メニューをご用意いたしました。",
    content_kr: "봄 계절 메뉴를 준비했습니다.",
    category: "menu",
    priority: 2,
    is_active: true,
    target_audience: "restaurant",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Wholesale Price Update",
    title_jp: "卸売価格更新",
    title_kr: "도매 가격 업데이트",
    content: "Updated wholesale pricing effective from next month.",
    content_jp: "来月より卸売価格を更新いたします。",
    content_kr: "다음 달부터 도매 가격을 업데이트합니다.",
    category: "pricing",
    priority: 1,
    is_active: true,
    target_audience: "wholesale",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function TopicDisplay({ language, targetAudience }: TopicDisplayProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const texts = {
    ja: {
      title: "お知らせ・トピック",
      all: "すべて",
      product: "商品",
      menu: "メニュー",
      pricing: "価格",
      general: "一般",
      priority: "重要度",
      noTopics: "トピックがありません",
      demoMode: "デモモード",
    },
    ko: {
      title: "공지사항・토픽",
      all: "전체",
      product: "상품",
      menu: "메뉴",
      pricing: "가격",
      general: "일반",
      priority: "중요도",
      noTopics: "토픽이 없습니다",
      demoMode: "데모 모드",
    },
    en: {
      title: "News & Topics",
      all: "All",
      product: "Product",
      menu: "Menu",
      pricing: "Pricing",
      general: "General",
      priority: "Priority",
      noTopics: "No topics available",
      demoMode: "Demo Mode",
    },
  }

  const t = texts[language]

  useEffect(() => {
    fetchTopics()
  }, [targetAudience])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      if (isDemo) {
        // Filter demo topics based on target audience
        const filtered = demoTopics.filter(
          (topic) =>
            targetAudience === "both" || topic.target_audience === targetAudience || topic.target_audience === "both",
        )
        setTopics(filtered)
      } else {
        let query = supabase
          .from("topics")
          .select("*")
          .eq("is_active", true)
          .order("priority", { ascending: false })
          .order("created_at", { ascending: false })

        if (targetAudience !== "both") {
          query = query.in("target_audience", [targetAudience, "both"])
        }

        const { data, error } = await query

        if (error) throw error
        setTopics(data || [])
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
      // Fallback to demo data
      const filtered = demoTopics.filter(
        (topic) =>
          targetAudience === "both" || topic.target_audience === targetAudience || topic.target_audience === "both",
      )
      setTopics(filtered)
    } finally {
      setLoading(false)
    }
  }

  const getTopicTitle = (topic: Topic) => {
    switch (language) {
      case "ja":
        return topic.title_jp || topic.title
      case "ko":
        return topic.title_kr || topic.title
      default:
        return topic.title
    }
  }

  const getTopicContent = (topic: Topic) => {
    switch (language) {
      case "ja":
        return topic.content_jp || topic.content
      case "ko":
        return topic.content_kr || topic.content
      default:
        return topic.content
    }
  }

  const filteredTopics =
    selectedCategory === "all" ? topics : topics.filter((topic) => topic.category === selectedCategory)

  const categories = ["all", "product", "menu", "pricing", "general"]

  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return "destructive"
    if (priority >= 2) return "default"
    return "secondary"
  }

  const getPriorityText = (priority: number) => {
    if (priority >= 3) return "高"
    if (priority >= 2) return "中"
    return "低"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t.title}
            {isDemo && <Badge variant="outline">{t.demoMode}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {t[category as keyof typeof t]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTopics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{getTopicTitle(topic)}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(topic.priority)}>
                    <Star className="h-3 w-3 mr-1" />
                    {getPriorityText(topic.priority)}
                  </Badge>
                  <Badge variant="outline">{topic.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{getTopicContent(topic)}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(topic.created_at).toLocaleDateString(
                  language === "ja" ? "ja-JP" : language === "ko" ? "ko-KR" : "en-US",
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTopics.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">{t.noTopics}</div>
      )}
    </div>
  )
}
