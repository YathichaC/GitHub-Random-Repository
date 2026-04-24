import { Octokit } from "https://esm.sh/octokit";
import { langColors } from './colors.js';

const select = document.getElementById('lang-dropdown');

fetch('language.json')
  .then(response => {
    console.log('ok');
    return response.json();
  })
  .then(data => {
    data.forEach(item => {
      let opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.title;
      select.appendChild(opt);
    });
  })
  .catch(err => console.error(err));

select.addEventListener('change', async function() {
    const container = document.getElementById('finder-container');
    const result_area = document.getElementById('info');
    container.style.borderColor = 'transparent';
    const metaRow = document.getElementById('meta-row');
    if (metaRow) metaRow.innerHTML = '';
    container.style.border = 'none';
    container.style.cursor = 'default';
    result_area.innerHTML = 'Loading, please wait...';
    container.style.backgroundColor = '#e9ecef';
    console.log(select.value);

    try{
        const octokit = new Octokit();
        let res = await octokit.request('GET /search/repositories', {
            headers: {
                'X-GitHub-Api-Version': '2026-03-10',
            },
            q: `language:${select.value}`,
            per_page: 1
        })

        if(res.status === 200){
            const repo = res.data.items;

            console.log(repo);
            
            container.onclick = () => {
              window.open(repo[0].svn_url);
            };

            result_area.innerHTML = '';
            result_area.innerHTML = `
              <div class="repo-card">
                <h4 class="repo-name"><span style="font-weight: bold;">${repo[0].name}</span></h4>
                <p class="repo-desc">${repo[0].description || 'No description'}</p>
                <div class="repo-meta">
                  <span class="lang">
                    <span class="circle" style="background-color:${langColors[select.value]?.color || '#ccc'}"></span>
                    ${select.value}
                  </span>
                  <span><i class="fa-solid fa-star"></i> ${repo[0].stargazers_count}</span>
                  <span><i class="fa-solid fa-code-fork"></i> ${repo[0].forks_count}</span>
                  <span><i class="fa-solid fa-circle-exclamation"></i> ${repo[0].open_issues_count}</span>
                </div>
              </div>
            `;

            container.style.backgroundColor = 'white';
            container.style.border = '2px solid black';
            container.style.borderRadius = '12px';
            container.style.paddingTop = '16px';
            container.style.paddingBottom = '16px';
            container.style.cursor = 'pointer';
        }
    }
    
    catch (err) {
        console.error(err);
        result_area.innerHTML = 'Error fetching repository';
        container.style.backgroundColor = '#ffc9c9';
  }
})
