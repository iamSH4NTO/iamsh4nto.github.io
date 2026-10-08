/**
 * iamSH4NTO — Personal Site Application Logic
 * Vanilla JavaScript (ES2022+), zero external dependencies
 */

(function () {
  'use strict';

  const CACHE_KEY = 'skf-site-cache-v1';
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

  const LIVE_PATH = 'assets/data/live.json';
  const FALLBACK_PATH = 'assets/data/fallback.json';

  const LANGUAGE_COLORS = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Vue: '#41b883',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Go: '#00ADD8',
    PHP: '#4F5D95'
  };
  const DEFAULT_LANG_COLOR = '#a371f7';

  // Section 6B: Curated Projects
  const CURATED_PROJECTS = [
    {
      title: 'SKF Duty Calculator',
      description: 'Shipped Android app (Expo React Native + Cloudflare Workers/D1), live on Google Play with 100+ installs.',
      tags: ['React Native', 'Expo', 'Cloudflare D1'],
      url: 'https://play.google.com/store/apps/details?id=com.skf.duty',
      buttonLabel: 'View on Google Play',
      language: 'TypeScript',
      stars: 0,
      forks: 0
    },
    {
      title: 'CircleNetwork',
      description: 'Expo React Native app with WebViews, themes, downloads, custom splash.',
      tags: ['React Native', 'Expo', 'TypeScript'],
      url: 'https://github.com/iamSH4NTO/CircleNetwork',
      buttonLabel: 'View on GitHub',
      language: 'TypeScript',
      stars: 0,
      forks: 0
    },
    {
      title: 'shantotv',
      description: 'Live TV web app.',
      tags: ['JavaScript', 'Live TV', 'Web'],
      url: 'https://github.com/iamSH4NTO/shantotv',
      buttonLabel: 'View on GitHub',
      language: 'HTML',
      stars: 0,
      forks: 0
    },
    {
      title: 'BloodDonation',
      description: 'Vue blood-donation finder.',
      tags: ['Vue', 'JavaScript', 'Health'],
      url: 'https://github.com/iamSH4NTO/BloodDonation',
      buttonLabel: 'View on GitHub',
      language: 'Vue',
      stars: 0,
      forks: 0
    }
  ];

  // SVG Icon Templates (Exact octicon paths from seed/icons)
  const ICON_REPO = '<svg class="octicon repo-octicon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>';
  const ICON_STAR = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.751.751 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"/></svg>';
  const ICON_FORK = '<svg class="octicon" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>';
  const ICON_EXTERNAL = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M10.604 1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.75.75 0 0 1-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1zM3.75 2A1.75 1.75 0 0 0 2 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 12.25v-3.5a.75.75 0 0 0-1.5 0v3.5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-8.5a.25.25 0 0 1 .25-.25h3.5a.75.75 0 0 0 0-1.5h-3.5z"/></svg>';

  // State
  let globalState = {
    user: null,
    repos: [],
    contributions: null,
    fallback: null
  };

  /**
   * Safe HTML escaping
   */
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Helper to format numbers with commas
   */
  function formatNumber(num) {
    if (num == null || isNaN(num)) return '0';
    return Number(num).toLocaleString();
  }

  /**
   * Cache management with localStorage
   */
  function getCachedData() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.timestamp) return null;
      const age = Date.now() - data.timestamp;
      if (age > CACHE_TTL_MS) return null;
      return data;
    } catch {
      return null;
    }
  }

  function setCachedData(data) {
    try {
      const entry = {
        timestamp: Date.now(),
        user: data.user,
        repos: data.repos,
        contributions: data.contributions
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
      // localStorage may be disabled or full
    }
  }

  /**
   * Load offline fallback data
   */
  async function loadFallback() {
    if (globalState.fallback) return globalState.fallback;
    try {
      const res = await fetch(FALLBACK_PATH);
      if (res.ok) {
        globalState.fallback = await res.json();
        return globalState.fallback;
      }
    } catch {
      // ignore
    }
    return null;
  }

  /**
   * Fetch live data from same-origin live.json
   */
  async function fetchAllData(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        globalState.user = cached.user;
        globalState.repos = cached.repos || [];
        globalState.contributions = cached.contributions;
        renderAll(cached, false);
      }
    }

    try {
      const res = await fetch(LIVE_PATH + (forceRefresh ? '?v=' + Date.now() : ''));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const live = await res.json();

      globalState.user = live.user;
      globalState.repos = live.repos || [];
      globalState.contributions = live.contributions;

      renderUser(live.user, false);
      renderStats(live.user, live.repos, false);
      renderPinned(live.repos, false);
      renderRepos(live.repos, false);
      renderContributions(live.contributions, false);

      setCachedData({
        user: live.user,
        repos: live.repos,
        contributions: live.contributions
      });
    } catch {
      const cached = getCachedData();
      if (cached) {
        globalState.user = cached.user;
        globalState.repos = cached.repos || [];
        globalState.contributions = cached.contributions;
        renderUser(cached.user, true);
        renderStats(cached.user, cached.repos, true);
        renderPinned(cached.repos, true);
        renderRepos(cached.repos, true);
        renderContributions(cached.contributions, true);
      } else {
        const fallback = await loadFallback();
        if (fallback) {
          globalState.user = fallback.user;
          globalState.repos = fallback.repos || [];
          globalState.contributions = fallback.contributions;
          renderUser(fallback.user, true);
          renderStats(fallback.user, fallback.repos, true);
          renderPinned(fallback.repos, true);
          renderRepos(fallback.repos, true);
          renderContributions(fallback.contributions, true);
        }
      }
    }
  }

  /**
   * Render User / Sidebar
   */
  function renderUser(user, isOffline) {
    if (!user) return;
    const nameEl = document.getElementById('profile-fullname');
    const bioEl = document.getElementById('profile-bio');
    const handleEl = document.getElementById('profile-handle');
    const offlineNote = document.getElementById('sidebar-offline-note');

    if (nameEl && user.name) nameEl.textContent = user.name;
    if (bioEl && user.bio) {
      bioEl.textContent = user.bio === 'Web Developer'
        ? 'Web Developer — I build practical software for real users: web apps, dashboards, APIs and shipped mobile apps.'
        : user.bio;
    }
    if (handleEl && user.login) handleEl.textContent = `@${user.login}`;

    if (offlineNote) {
      offlineNote.classList.toggle('hidden', !isOffline);
    }
  }

  /**
   * Render Stat Cards
   */
  function renderStats(user, repos, isOffline) {
    const reposEl = document.getElementById('stat-repos');
    const starsEl = document.getElementById('stat-stars');
    const followersEl = document.getElementById('stat-followers');
    const followingEl = document.getElementById('stat-following');
    const noteEl = document.getElementById('stats-offline-note');

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum, r) => (!r.fork ? sum + (r.stargazers_count || 0) : sum), 0)
      : (globalState.fallback?.stars || 0);

    const publicRepos = user?.public_repos ?? (Array.isArray(repos) ? repos.length : 10);
    const followers = user?.followers ?? 1;
    const following = user?.following ?? 1;

    if (reposEl) {
      reposEl.textContent = formatNumber(publicRepos);
      reposEl.classList.remove('skeleton');
    }
    if (starsEl) {
      starsEl.textContent = formatNumber(totalStars);
      starsEl.classList.remove('skeleton');
    }
    if (followersEl) {
      followersEl.textContent = formatNumber(followers);
      followersEl.classList.remove('skeleton');
    }
    if (followingEl) {
      followingEl.textContent = formatNumber(following);
      followingEl.classList.remove('skeleton');
    }

    const tabCountBadge = document.getElementById('tab-repos-count');
    if (tabCountBadge) {
      tabCountBadge.textContent = String(publicRepos);
    }

    if (noteEl) {
      noteEl.classList.toggle('hidden', !isOffline);
    }
  }

  /**
   * Build Pinned Repositories list (§4F)
   * 4 featured projects first, then recently pushed non-fork repos, up to 6 total.
   */
  function renderPinned(repos, isOffline) {
    const container = document.getElementById('pinned-grid');
    const noteEl = document.getElementById('pinned-offline-note');
    if (!container) return;

    if (noteEl) {
      noteEl.classList.toggle('hidden', !isOffline);
    }

    const repoMap = new Map();
    if (Array.isArray(repos)) {
      for (const r of repos) {
        if (r && r.name) {
          repoMap.set(r.name.toLowerCase(), r);
        }
      }
    }

    const pinnedList = [];

    // 1. Curated projects first
    for (const proj of CURATED_PROJECTS) {
      const match = repoMap.get(proj.title.toLowerCase());
      pinnedList.push({
        name: proj.title,
        url: proj.url,
        description: match?.description || proj.description,
        language: match?.language || proj.language,
        stars: match ? match.stargazers_count : proj.stars,
        forks: match ? match.forks_count : proj.forks
      });
    }

    // 2. Most recently pushed public non-fork repos up to 6 total
    if (Array.isArray(repos)) {
      const nonForks = repos.filter(r => !r.fork);
      for (const r of nonForks) {
        if (pinnedList.length >= 6) break;
        const alreadyIn = pinnedList.some(p => p.name.toLowerCase() === r.name.toLowerCase());
        if (!alreadyIn) {
          pinnedList.push({
            name: r.name,
            url: r.html_url,
            description: r.description || 'No description provided.',
            language: r.language || null,
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0
          });
        }
      }
    }

    container.innerHTML = pinnedList.map(item => createRepoCardHtml(item)).join('');
  }

  /**
   * Render Repositories full grid
   */
  function renderRepos(repos, isOffline) {
    const container = document.getElementById('repos-grid');
    const countEl = document.getElementById('repos-filter-count');
    const noteEl = document.getElementById('repos-offline-note');
    if (!container) return;

    if (noteEl) {
      noteEl.classList.toggle('hidden', !isOffline);
    }

    const list = Array.isArray(repos) ? repos : (globalState.fallback?.repos || []);

    if (countEl) {
      countEl.textContent = `Showing ${list.length} public repositories`;
    }

    container.innerHTML = list.map(r => createRepoCardHtml({
      name: r.name,
      url: r.html_url,
      description: r.description || 'No description provided.',
      language: r.language,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0
    })).join('');
  }

  /**
   * Helper to generate a repo card HTML
   */
  function createRepoCardHtml(item) {
    const lang = item.language || 'Plain Text';
    const langColor = LANGUAGE_COLORS[item.language] || DEFAULT_LANG_COLOR;

    return `
      <article class="repo-card">
        <div class="repo-card-top">
          <div class="repo-card-header">
            ${ICON_REPO}
            <a href="${escapeHtml(item.url)}" class="repo-name-link" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a>
          </div>
          <p class="repo-description">${escapeHtml(item.description)}</p>
        </div>
        <div class="repo-card-footer">
          <div class="repo-lang">
            <span class="lang-dot" style="background-color: ${langColor};"></span>
            <span>${escapeHtml(lang)}</span>
          </div>
          <div class="repo-stat-item">
            ${ICON_STAR}
            <span>${formatNumber(item.stars)}</span>
          </div>
          <div class="repo-stat-item">
            ${ICON_FORK}
            <span>${formatNumber(item.forks)}</span>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Render Curated Projects Tab
   */
  function renderProjectsTab() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = CURATED_PROJECTS.map(proj => {
      const tagsHtml = proj.tags.map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('');
      return `
        <article class="project-card">
          <div class="project-card-body">
            <div class="project-title-row">
              <h3 class="project-title">${escapeHtml(proj.title)}</h3>
            </div>
            <p class="project-desc">${escapeHtml(proj.description)}</p>
            <div class="project-tags">${tagsHtml}</div>
          </div>
          <div class="project-card-footer">
            <a href="${escapeHtml(proj.url)}" class="btn-project" target="_blank" rel="noopener noreferrer">
              <span>${escapeHtml(proj.buttonLabel)}</span>
              ${ICON_EXTERNAL}
            </a>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * Render Contributions Heatmap (§4G)
   * 53 week columns x 7 day rows
   */
  function renderContributions(contribData, isFailed) {
    const titleEl = document.getElementById('activity-title');
    const scrollArea = document.getElementById('heatmap-scroll-area');
    const fallbackImg = document.getElementById('contributions-fallback-img');
    const container = document.getElementById('heatmap-container');
    const noteEl = document.getElementById('activity-offline-note');

    if (noteEl) {
      noteEl.classList.toggle('hidden', !isFailed);
    }

    if (isFailed || !contribData || !Array.isArray(contribData.contributions) || contribData.contributions.length === 0) {
      if (titleEl) {
        const count = contribData?.total?.lastYear ?? contribData?.lastYear ?? 2875;
        titleEl.textContent = `${formatNumber(count)} contributions in the last year`;
      }
      if (scrollArea) scrollArea.style.display = 'none';
      if (fallbackImg) fallbackImg.classList.remove('hidden');
      return;
    }

    // Success: show real heatmap
    if (scrollArea) scrollArea.style.display = 'block';
    if (fallbackImg) fallbackImg.classList.add('hidden');

    const totalCount = contribData.total?.lastYear ?? 2875;
    if (titleEl) {
      titleEl.textContent = `${formatNumber(totalCount)} contributions in the last year`;
    }

    const contributions = contribData.contributions;
    const totalDays = contributions.length;

    // Group days into 53 weeks (columns)
    // contributions[0] is typically a Sunday
    const weeks = [];
    let currentWeek = [];

    for (let i = 0; i < totalDays; i++) {
      currentWeek.push(contributions[i]);
      if (currentWeek.length === 7 || i === totalDays - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Ensure we have at most 53 weeks
    while (weeks.length > 53) {
      weeks.shift();
    }

    // Determine month labels across week columns
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthHeaders = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks.length; w++) {
      const firstDay = weeks[w][0];
      if (firstDay && firstDay.date) {
        const d = new Date(firstDay.date + 'T00:00:00Z');
        const m = d.getUTCMonth();
        if (m !== lastMonth) {
          monthHeaders.push({ weekIndex: w, name: monthNames[m] });
          lastMonth = m;
        }
      }
    }

    // Build DOM structure
    container.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'heatmap-grid-inner';

    // Day labels column
    const dayLabelsCol = document.createElement('div');
    dayLabelsCol.className = 'heatmap-day-labels';
    dayLabelsCol.setAttribute('aria-hidden', 'true');
    dayLabelsCol.innerHTML = `
      <span class="heatmap-day-label" style="visibility: hidden;">Sun</span>
      <span class="heatmap-day-label">Mon</span>
      <span class="heatmap-day-label" style="visibility: hidden;">Tue</span>
      <span class="heatmap-day-label">Wed</span>
      <span class="heatmap-day-label" style="visibility: hidden;">Thu</span>
      <span class="heatmap-day-label">Fri</span>
      <span class="heatmap-day-label" style="visibility: hidden;">Sat</span>
    `;
    inner.appendChild(dayLabelsCol);

    // Main area (months row + weeks grid)
    const mainArea = document.createElement('div');
    mainArea.className = 'heatmap-main';

    // Months row
    const monthsRow = document.createElement('div');
    monthsRow.className = 'heatmap-months-row';
    monthsRow.setAttribute('aria-hidden', 'true');

    for (const mh of monthHeaders) {
      const mSpan = document.createElement('span');
      mSpan.className = 'heatmap-month-col';
      mSpan.style.left = `${mh.weekIndex * 14}px`;
      mSpan.textContent = mh.name;
      monthsRow.appendChild(mSpan);
    }
    mainArea.appendChild(monthsRow);

    // Weeks row
    const weeksRow = document.createElement('div');
    weeksRow.className = 'heatmap-weeks-row';
    weeksRow.setAttribute('role', 'grid');
    weeksRow.setAttribute('aria-label', 'Contribution activity calendar');

    const tooltipEl = document.getElementById('tooltip');

    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w];
      const weekCol = document.createElement('div');
      weekCol.className = 'heatmap-week-col';
      weekCol.setAttribute('role', 'row');

      for (let d = 0; d < 7; d++) {
        const item = week[d];
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';

        if (item) {
          const level = Math.min(Math.max(item.level ?? 0, 0), 4);
          cell.classList.add(`level-${level}`);

          const dateObj = new Date(item.date + 'T00:00:00Z');
          const dateStr = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
          });

          const label = `${item.count} contribution${item.count === 1 ? '' : 's'} on ${dateStr}`;
          cell.setAttribute('tabindex', '0');
          cell.setAttribute('role', 'gridcell');
          cell.setAttribute('aria-label', label);

          const showTooltip = () => {
            if (!tooltipEl) return;
            tooltipEl.textContent = label;
            const rect = cell.getBoundingClientRect();
            tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
            tooltipEl.style.top = `${rect.top}px`;
            tooltipEl.classList.add('visible');
          };

          const hideTooltip = () => {
            if (!tooltipEl) return;
            tooltipEl.classList.remove('visible');
          };

          cell.addEventListener('mouseenter', showTooltip);
          cell.addEventListener('mouseleave', hideTooltip);
          cell.addEventListener('focus', showTooltip);
          cell.addEventListener('blur', hideTooltip);
        } else {
          cell.classList.add('level-0');
          cell.style.visibility = 'hidden';
        }

        weekCol.appendChild(cell);
      }
      weeksRow.appendChild(weekCol);
    }

    mainArea.appendChild(weeksRow);
    inner.appendChild(mainArea);
    container.appendChild(inner);

    // Scroll to end of heatmap so latest activity is in view
    setTimeout(() => {
      if (scrollArea) {
        scrollArea.scrollLeft = scrollArea.scrollWidth;
      }
    }, 50);
  }

  /**
   * Render all components from given dataset
   */
  function renderAll(data, isOffline) {
    if (!data) return;
    renderUser(data.user, isOffline);
    renderStats(data.user, data.repos, isOffline);
    renderPinned(data.repos, isOffline);
    renderRepos(data.repos, isOffline);
    renderContributions(data.contributions, isOffline);
  }

  /**
   * Setup Tabs Navigation & Keyboard Support (§4D)
   */
  function initTabs() {
    const tabButtons = Array.from(document.querySelectorAll('.tab-item'));
    const tabPanels = {
      'tab-overview': document.getElementById('panel-overview'),
      'tab-repositories': document.getElementById('panel-repositories'),
      'tab-projects': document.getElementById('panel-projects')
    };

    function activateTab(tabBtn) {
      if (!tabBtn) return;
      const targetId = tabBtn.id;

      tabButtons.forEach(btn => {
        const isActive = btn === tabBtn;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      Object.entries(tabPanels).forEach(([key, panel]) => {
        if (!panel) return;
        const isActive = key === targetId;
        panel.classList.toggle('active', isActive);
        if (isActive) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      // Sync top navigation active link
      document.querySelectorAll('.nav-link[data-tab-target]').forEach(link => {
        const linkTarget = link.getAttribute('data-tab-target');
        link.classList.toggle('active', linkTarget === targetId);
      });
    }

    tabButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => activateTab(btn));

      btn.addEventListener('keydown', e => {
        let newIndex = index;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = tabButtons.length - 1;
        } else {
          return;
        }

        e.preventDefault();
        tabButtons[newIndex].focus();
        activateTab(tabButtons[newIndex]);
      });
    });

    // Top nav link clicks
    document.querySelectorAll('.nav-link[data-tab-target]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const tabTargetId = link.getAttribute('data-tab-target');
        const targetBtn = document.getElementById(tabTargetId);
        if (targetBtn) {
          activateTab(targetBtn);
          const mainArea = document.getElementById('main-content');
          if (mainArea) {
            mainArea.scrollIntoView({ behavior: 'smooth' });
          }
        }
        // Close mobile nav if open
        const navCenter = document.getElementById('nav-center');
        if (navCenter) navCenter.classList.remove('open');
      });
    });

    // Contact link scroll
    const contactNavLink = document.querySelector('.nav-link[href="#contact"]');
    if (contactNavLink) {
      contactNavLink.addEventListener('click', () => {
        const navCenter = document.getElementById('nav-center');
        if (navCenter) navCenter.classList.remove('open');
      });
    }
  }

  /**
   * Setup Mobile Navigation Toggle
   */
  function initMobileNav() {
    const toggleBtn = document.getElementById('nav-toggle');
    const navCenter = document.getElementById('nav-center');
    if (!toggleBtn || !navCenter) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = navCenter.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /**
   * Setup Live Repository Search Filtering
   */
  function initSearch() {
    const searchInput = document.getElementById('repo-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', e => {
      const query = (e.target.value || '').trim().toLowerCase();
      const allRepos = globalState.repos.length > 0
        ? globalState.repos
        : (globalState.fallback?.repos || []);

      // If user types and is on overview, switch to Repositories tab
      if (query.length > 0) {
        const repoTabBtn = document.getElementById('tab-repositories');
        if (repoTabBtn && !repoTabBtn.classList.contains('active')) {
          repoTabBtn.click();
        }
      }

      const filtered = allRepos.filter(r => {
        const name = (r.name || '').toLowerCase();
        const desc = (r.description || '').toLowerCase();
        const lang = (r.language || '').toLowerCase();
        return name.includes(query) || desc.includes(query) || lang.includes(query);
      });

      const container = document.getElementById('repos-grid');
      const countEl = document.getElementById('repos-filter-count');

      if (countEl) {
        countEl.textContent = query.length > 0
          ? `Found ${filtered.length} of ${allRepos.length} repositories matching "${query}"`
          : `Showing ${allRepos.length} public repositories`;
      }

      if (container) {
        if (filtered.length === 0) {
          container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-cards); border: 1px solid var(--border-color);">
              <p style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">No repositories found</p>
              <p>No public repositories matched your search query.</p>
            </div>
          `;
        } else {
          container.innerHTML = filtered.map(r => createRepoCardHtml({
            name: r.name,
            url: r.html_url,
            description: r.description || 'No description provided.',
            language: r.language,
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0
          })).join('');
        }
      }
    });
  }

  /**
   * Setup Copy Email Button Action
   */
  function initCopyEmail() {
    document.querySelectorAll('.btn-copy-email').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'i@shanto.top';
        let copied = false;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(email);
            copied = true;
          } catch {
            copied = false;
          }
        }

        if (!copied) {
          window.prompt('Copy email address:', email);
          copied = true;
        }

        if (copied) {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        }
      });
    });
  }

  /**
   * Setup Refresh Button Action
   */
  function initRefresh() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (!refreshBtn) return;

    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('spinning');
      try {
        localStorage.removeItem(CACHE_KEY);
        await fetchAllData(true);
      } finally {
        setTimeout(() => {
          refreshBtn.classList.remove('spinning');
        }, 500);
      }
    });
  }

  /**
   * Dynamic Year in Footer
   */
  function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /**
   * Application bootstrap
   */
  document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initTabs();
    initMobileNav();
    initSearch();
    initCopyEmail();
    initRefresh();
    renderProjectsTab();

    // Start data fetching
    fetchAllData(false);
  });
})();
