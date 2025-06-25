import { supabase, isDemo } from "./database"

export async function generateOrderNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()

  // If in demo mode, generate a simple demo order number
  if (isDemo) {
    const randomNum = Math.floor(Math.random() * 9999) + 1
    return `${currentYear}${randomNum.toString().padStart(4, "0")}`
  }

  try {
    // 現在年度のシーケンスを取得または作成
    const { data: sequence, error: fetchError } = await supabase
      .from("order_sequences")
      .select("*")
      .eq("year", currentYear)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError
    }

    let nextNumber = 1

    if (sequence) {
      // 既存のシーケンスを更新
      nextNumber = sequence.last_number + 1
      const { error: updateError } = await supabase
        .from("order_sequences")
        .update({
          last_number: nextNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("year", currentYear)

      if (updateError) throw updateError
    } else {
      // 新しい年度のシーケンスを作成
      const { error: insertError } = await supabase.from("order_sequences").insert({
        year: currentYear,
        last_number: nextNumber,
      })

      if (insertError) throw insertError
    }

    // 8桁の受注番号を生成 (YYYYNNNN形式)
    const orderNumber = `${currentYear}${nextNumber.toString().padStart(4, "0")}`
    return orderNumber
  } catch (error) {
    console.error("Error generating order number:", error)
    // Fallback to demo mode if database fails
    const randomNum = Math.floor(Math.random() * 9999) + 1
    return `${currentYear}${randomNum.toString().padStart(4, "0")}`
  }
}
