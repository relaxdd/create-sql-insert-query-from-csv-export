export default function isNumberInRange(num: number, range: [number, number]) {
  return num >= range[0] && num <= range[1]
}