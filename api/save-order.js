export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' });
  }

  try {
    const { sha, content, message } = req.body;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const USER = 'buxie78';
    const REPO = 'buxie78.github.io';
    const DATA_FILE_PATH = 'club-data.json';

    const putRes = await fetch(
      `https://api.github.com/repos/${USER}/${REPO}/contents/${DATA_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: message,
          content: content,
          sha: sha,
        }),
      }
    );

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(`GitHub API错误：${putRes.status} - ${errData.message || '未知错误'}`);
    }

    return res.status(200).json({ success: true, message: '数据同步成功' });
  } catch (error) {
    console.error('服务端错误：', error);
    return res.status(500).json({ error: error.message || '数据同步失败' });
  }
}
