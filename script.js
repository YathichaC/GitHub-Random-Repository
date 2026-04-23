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
    result_area.innerHTML = 'Loading, please wait...';
    container.style.backgroundColor = 'white';
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
            console.log(langColors[select.value].color);
            result_area.innerHTML = '';
            result_area.innerHTML = `
                <p>${repo[0].name}</p>
                <p>${repo[0].description}</p>
                <p><span style="height: 9px; width: 9px; background-color: ${langColors[select.value].color}; border-radius: 50%; display: inline-block;"></span></p>
                <p>${select.value}</p>
                <i class="fa-solid fa-star"></i>
                <p>${repo[0].stargazers_count}</p>
                <i class="fa-solid fa-code-fork"></i>
                <p>${repo[0].forks_count}</p>
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>${repo[0].open_issues_count}</p>
            `;
        }
    }
    
    catch (err) {
        console.error(err);
        result_area.innerHTML = 'Error fetching repository';
        container.style.backgroundColor = '#ffc9c9'; // error
  }
})
