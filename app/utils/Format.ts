const priceFormatter = new Intl.NumberFormat('ru-RU')
const NBSP = '\u00A0'

export function formatPrice(rubles: number) {
  return `${priceFormatter.format(rubles)}${NBSP}₽`
}
