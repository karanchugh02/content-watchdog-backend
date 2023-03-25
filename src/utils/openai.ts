import axios from 'axios';
import { env } from '../../constants';
class OpenAi {
  public static async textScanner(text: string) {
    let response = await axios.post(
      `https://api.openai.com/v1/moderations`,
      { input: text },
      { headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` } }
    );
    return response.data;
  }
}

export default OpenAi;
