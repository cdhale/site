import { ref } from '@nuxtjs/composition-api'
import axios from 'axios'
const lordsPrice = ref(null)

const useLordsPrice = () => {
  const getLordsPrice = async () => {
    const price = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=lords&vs_currencies=USD'
    )
    lordsPrice.value = price.data['lords'].usd
  }

  return {
    lordsPrice,
    getLordsPrice,
  }
}

export default useLordsPrice
