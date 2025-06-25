"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, AlertCircle } from "lucide-react"
import { supabase, isDemo, type Topic } from "@/lib/database"

interface TopicManagementProps {
  language: "ja" | "ko" | "en"
}

export function TopicManagement({ language }: TopicManagementProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Partial<Topic>>({})
  const [loading, setLoading] = useState(false)

  const texts = {
    ja: {
      title: "トピック管理",
      addNew: "新規追加",
      edit: "編集",
      delete: "削除",
      save: "保存",
      cancel: "キャンセル",
      titleField: "タイトル",
      titleJp: "タイトル（日本語）",
      titleKr: "タイトル（韓国語）",
      content: "内容",
      contentJp: "内容（日本語）",
      contentKr: "内容（韓国語）",
      category: "カテゴリー",
      priority: "優先度",
      targetAudience: "対象",
      isActive: "アクティブ",
      wholesale: "卸売",
      restaurant: "飲食店",
      both: "両方",
      product: "商品",
      menu: "メニュー",
      pricing: "価格",
      general: "一般",
      demoMode: "デモモード",
      demoWarning: "デモモードでは変更は保存されません",
    },
    ko: {
      title: "토픽 관리",
      addNew: "신규 추가",
      edit: "편집",
      delete: "삭제",
      save: "저장",
      cancel: "취소",
      titleField: "제목",
      titleJp: "제목（일본어）",
      titleKr: "제목（한국어）",
      content: "내용",
      contentJp: "내용（일본어）",
      contentKr: "내용（한국어）",
      category: "카테고리",
      priority: "우선순위",
      targetAudience: "대상",
      isActive: "활성",
      wholesale: "도매",
      restaurant: "음식점",
      both: "둘 다",
      product: "상품",
      menu: "메뉴",
      pricing: "가격",
      general: "일반",
      demoMode: "데모 모드",
      demoWarning: "데모 모드에서는 변경사항이 저장되지 않습니다",
    },
    en: {
      title: "Topic Management",
      addNew: "Add New",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      titleField: "Title",
      titleJp: "Title (Japanese)",
      titleKr: "Title (Korean)",
      content: "Content",
      contentJp: "Content (Japanese)",
      contentKr: "Content (Korean)",
      category: "Category",
      priority: "Priority",
      targetAudience: "Target Audience",
      isActive: "Active",
      wholesale: "Wholesale",
      restaurant: "Restaurant",
      both: "Both",
      product: "Product",
      menu: "Menu",
      pricing: "Pricing",
      general: "General",
      demoMode: "Demo Mode",
      demoWarning: "Changes are not saved in demo mode",
    },
  }

  const t = texts[language]

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      if (isDemo) {
        // Use empty array for demo mode in management
        setTopics([])
      } else {
        const { data, error } = await supabase.from("topics").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setTopics(data || [])
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingTopic.title || !editingTopic.content) return

    if (isDemo) {
      // In demo mode, just simulate success
      alert(t.demoWarning)
      setIsEditing(false)
      setEditingTopic({})
      return
    }

    setLoading(true)
    try {
      if (editingTopic.id) {
        // 更新
        const { error } = await supabase
          .from("topics")
          .update({
            ...editingTopic,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingTopic.id)

        if (error) throw error
      } else {
        // 新規作成
        const { error } = await supabase.from("topics").insert([editingTopic])

        if (error) throw error
      }

      await fetchTopics()
      setIsEditing(false)
      setEditingTopic({})
    } catch (error) {
      console.error("Error saving topic:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (isDemo) {
      alert(t.demoWarning)
      return
    }

    if (!confirm("本当に削除しますか？")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("topics").delete().eq("id", id)

      if (error) throw error
      await fetchTopics()
    } catch (error) {
      console.error("Error deleting topic:", error)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (topic?: Topic) => {
    setEditingTopic(
      topic || {
        title: "",
        title_jp: "",
        title_kr: "",
        content: "",
        content_jp: "",
        content_kr: "",
        category: "general",
        priority: 1,
        target_audience: "both",
        is_active: true,
      },
    )
    setIsEditing(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{t.title}</h2>
          {isDemo && <Badge variant="outline">{t.demoMode}</Badge>}
        </div>
        <Button onClick={() => startEditing()}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addNew}
        </Button>
      </div>

      {isDemo && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{t.demoWarning}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTopic.id ? t.edit : t.addNew}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="title">{t.titleField}</Label>
                <Input
                  id="title"
                  value={editingTopic.title || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="title_jp">{t.titleJp}</Label>
                <Input
                  id="title_jp"
                  value={editingTopic.title_jp || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, title_jp: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="title_kr">{t.titleKr}</Label>
                <Input
                  id="title_kr"
                  value={editingTopic.title_kr || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, title_kr: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="content">{t.content}</Label>
                <Textarea
                  id="content"
                  value={editingTopic.content || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, content: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="content_jp">{t.contentJp}</Label>
                <Textarea
                  id="content_jp"
                  value={editingTopic.content_jp || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, content_jp: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="content_kr">{t.contentKr}</Label>
                <Textarea
                  id="content_kr"
                  value={editingTopic.content_kr || ""}
                  onChange={(e) => setEditingTopic({ ...editingTopic, content_kr: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="category">{t.category}</Label>
                <Select
                  value={editingTopic.category || "general"}
                  onValueChange={(value) => setEditingTopic({ ...editingTopic, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{t.general}</SelectItem>
                    <SelectItem value="product">{t.product}</SelectItem>
                    <SelectItem value="menu">{t.menu}</SelectItem>
                    <SelectItem value="pricing">{t.pricing}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">{t.priority}</Label>
                <Select
                  value={editingTopic.priority?.toString() || "1"}
                  onValueChange={(value) => setEditingTopic({ ...editingTopic, priority: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">低</SelectItem>
                    <SelectItem value="2">中</SelectItem>
                    <SelectItem value="3">高</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target_audience">{t.targetAudience}</Label>
                <Select
                  value={editingTopic.target_audience || "both"}
                  onValueChange={(value) => setEditingTopic({ ...editingTopic, target_audience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">{t.both}</SelectItem>
                    <SelectItem value="wholesale">{t.wholesale}</SelectItem>
                    <SelectItem value="restaurant">{t.restaurant}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editingTopic.is_active ?? true}
                  onCheckedChange={(checked) => setEditingTopic({ ...editingTopic, is_active: checked })}
                />
                <Label htmlFor="is_active">{t.isActive}</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {t.save}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card key={topic.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{topic.title}</h3>
                    <Badge variant={topic.is_active ? "default" : "secondary"}>
                      {topic.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{topic.category}</Badge>
                    <Badge variant="outline">{topic.target_audience}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{topic.content}</p>
                  <div className="text-xs text-muted-foreground">{new Date(topic.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditing(topic)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(topic.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {topics.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            {isDemo ? "デモモードでは管理機能は制限されています" : "トピックがありません"}
          </div>
        )}
      </div>
    </div>
  )
}
