// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const searchResults = document.getElementById('searchResults');
  const resultsInfo = document.getElementById('resultsInfo');
  const loading = document.getElementById('loading');

  // エラーメッセージ表示要素
  let searchErrorDiv = document.getElementById('searchError');

  // エラーメッセージを削除する関数
  function removeSearchError() {
    if (searchErrorDiv) {
      searchErrorDiv.remove();
      searchErrorDiv = null; // 削除後にnullを代入
    }
  }

  // エラーメッセージを表示する関数
  function displaySearchError(message) {
    removeSearchError(); // 既存のエラーメッセージを削除

    searchErrorDiv = document.createElement('div');
    searchErrorDiv.id = 'searchError';
    searchErrorDiv.className = 'search-error';
    searchErrorDiv.textContent = message;
    searchErrorDiv.style.color = 'red';

    const searchContainer = document.querySelector('.search-container');
    searchContainer.parentNode.insertBefore(searchErrorDiv, searchContainer.nextSibling);
  }


  // 検索を実行する関数
  async function performSearch() {
    const query = searchInput.value.trim();
    
    removeSearchError(); // 検索開始時にエラーメッセージを削除

    if (!query) {
      displaySearchError('検索語を入力してください');
      return;
    }

    // 検索中の表示
    loading.style.display = 'block';
    searchResults.innerHTML = '';
    resultsInfo.textContent = '';

    try {
      // Netlify Functionを呼び出す
      const response = await fetch(`/.netlify/functions/hello?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('検索リクエストに失敗しました');
      }

      const data = await response.json();
      
      // 検索結果の表示
      loading.style.display = 'none';
      
      if (data.count > 0) {
        resultsInfo.textContent = `${data.query} の検索結果: ${data.count}件表示 (全${data.totalCount}件)`;
        
        data.results.forEach(item => {
          const li = document.createElement('li');
          li.className = 'result-item';
          
          li.innerHTML = `
            <div class="result-title">${item.title}</div>
            <div class="result-category">${item.category}</div>
            <div class="result-description">${item.description}</div>
          `;
          
          searchResults.appendChild(li);
        });
        
        if (data.count < data.totalCount) {
          const moreResultsMsg = document.createElement('p');
          moreResultsMsg.textContent = `他にも${data.totalCount - data.count}件の結果があります。検索語を絞り込んでください。`;
          moreResultsMsg.style.textAlign = 'center';
          moreResultsMsg.style.marginTop = '10px';
          moreResultsMsg.style.fontStyle = 'italic';
          searchResults.appendChild(moreResultsMsg);
        }
      } else {
        resultsInfo.textContent = `${data.query} の検索結果: 0件`;
        
        const noResults = document.createElement('li');
        noResults.className = 'no-results';
        noResults.textContent = '検索結果が見つかりませんでした。別の検索語をお試しください。';
        searchResults.appendChild(noResults);
      }
    } catch (error) {
      loading.style.display = 'none';
      resultsInfo.textContent = 'エラーが発生しました';
      console.error('検索エラー:', error);
      
      const errorMsg = document.createElement('li');
      errorMsg.textContent = `検索処理中にエラーが発生しました: ${error.message}`;
      errorMsg.style.color = 'red';
      searchResults.appendChild(errorMsg);
    }
  }

  // 検索ボタンのクリックイベント
  searchButton.addEventListener('click', performSearch);
  
  // Enterキーのイベント
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
});
