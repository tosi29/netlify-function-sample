exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
        "Content-Type": "application/json"  // JSONであることを明示するヘッダーを追加
    },
    body: JSON.stringify({
        "query": "検索クエリ",
        "count": 3,
        "totalCount": 10,
        "results": [
          {
            "title": "検索結果タイトル1",
            "category": "カテゴリ1",
            "description": "この記事は検索結果の説明文です。"
          },
          {
            "title": "検索結果タイトル2",
            "category": "カテゴリ2",
            "description": "二つ目の検索結果の詳細な説明です。"
          },
          {
            "title": "検索結果タイトル3",
            "category": "カテゴリ3",
            "description": "三つ目の検索結果に関する情報です。"
          }
        ]
      })
  };
};
