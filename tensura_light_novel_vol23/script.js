document.addEventListener("DOMContentLoaded", function() {
    fetch('tensei_slime_volume23.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(text => {
            document.getElementById('loading').style.display = 'none';
            const contentDiv = document.getElementById('content');
            const lines = text.split('\n');
            
            let html = '';
            
            // Regex to detect Japanese characters (Hiragana, Katakana, Kanji)
            const japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

            lines.forEach(line => {
                line = line.trim();
                
                if (!line) return; // Skip empty lines

                // Heuristic for headers: Starts with "CHƯƠNG", "MỞ ĐẦU", "LỜI KẾT" and is mostly uppercase
                if ((line.startsWith("CHƯƠNG") || line.startsWith("MỞ ĐẦU") || line.startsWith("LỜI KẾT") || line.startsWith("PHỤ CHƯƠNG")) && line === line.toUpperCase()) {
                    html += `<h2>${escapeHtml(line)}</h2>`;
                } 
                // Detect "Lưu ý quan trọng" style note headers
                else if (line.includes("Lưu ý quan trọng")) {
                    html += `<div class="note-header">${escapeHtml(line)}</div>`;
                }
                // Detect Japanese lines
                else if (japaneseRegex.test(line)) {
                    html += `<p class="japanese">${escapeHtml(line)}</p>`;
                } 
                // Standard text
                else {
                    html += `<p>${escapeHtml(line)}</p>`;
                }
            });

            contentDiv.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching text file:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error-message').style.display = 'block';
        });
});

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>'"']/g, function(m) { return map[m]; });
}
