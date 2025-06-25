"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/components/language-provider"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"

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

export function TopicManagement() {
  const { t } = useLanguage()
  const [topics, setTopics] = useState<Topic[]>([
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

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    priority: "",
    publishDate: "",
    expiryDate: "",
    isActive: true,
  })

  const categories = [
    { value: "news", label: t.news, color: "bg-blue-100 text-blue-800" },
    { value: "promotion", label: t.promotion, color: "bg-green-100 text-green-800" },
    { value: "maintenance", label: t.maintenance, color: "bg-yellow-100 text-yellow-800" },
    { value: "announcement", label: t.announcement, color: "bg-purple-100 text-purple-800" },
  ]

  const priorities = [
    { value: "high", label: t.high, color: "bg-red-100 text-red-800" },
    { value: "medium", label: t.medium, color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: t.low, color: "bg-gray-100 text-gray-800" },
  ]

  const handleAddTopic = () => {
    setEditingTopic(null)
    setFormData({
      title: "",
      content: "",
      category: "",
      priority: "",
      publishDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic)
    setFormData({
      title: topic.title,
      content: topic.content,
      category: topic.category,
      priority: topic.priority,
      publishDate: topic.publishDate,
      expiryDate: topic.expiryDate || "",
      isActive: topic.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleSaveTopic = () => {
    if (editingTopic) {
      setTopics(
        topics.map((topic) =>
          topic.id === editingTopic.id
            ? {
                ...topic,
                title: formData.title,
                content: formData.content,
                category: formData.category as Topic["category"],
                priority: formData.priority as Topic["priority"],
                publishDate: formData.publishDate,
                expiryDate: formData.expiryDate || undefined,
                isActive: formData.isActive,
              }
            : topic,
        ),
      )
    } else {
      const newTopic: Topic = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: formData.category as Topic["category"],
        priority: formData.priority as Topic["priority"],
        publishDate: formData.publishDate,
        expiryDate: formData.expiryDate || undefined,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
      }
      setTopics([...topics, newTopic])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter((topic) => topic.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.topicManagement}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddTopic} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t.addTopic}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTopic ? t.editTopic : t.addTopic}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t.title}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="日本語 / 한국어"
                />
              </div>
              <div>
                <Label htmlFor="content">{t.content}</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="日本語 / 한국어"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">{t.category}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">{t.priority}</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((pri) => (
                        <SelectItem key={pri.value} value={pri.value}>
                          {pri.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publishDate">{t.publishDate}</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">{t.expiryDate}</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">{formData.isActive ? t.active : t.inactive}</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveTopic} className="flex-1">
                  {t.save}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  {t.cancel}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{t.topics}</span>
            <Badge variant="secondary">{topics.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.title}</TableHead>
                <TableHead>{t.category}</TableHead>
                <TableHead>{t.priority}</TableHead>
                <TableHead>{t.publishDate}</TableHead>
                <TableHead>{t.expiryDate}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{topic.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={categories.find((cat) => cat.value === topic.category)?.color}>
                      {categories.find((cat) => cat.value === topic.category)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorities.find((pri) => pri.value === topic.priority)?.color}>
                      {priorities.find((pri) => pri.value === topic.priority)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{topic.publishDate}</TableCell>
                  <TableCell>{topic.expiryDate || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={topic.isActive ? "default" : "secondary"}>
                      {topic.isActive ? t.active : t.inactive}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTopic(topic)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTopic(topic.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
