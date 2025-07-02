import React, { useState, useEffect } from 'react';
import { usePageData, Content, useLocation } from 'rspress/runtime';
import './styles/main.css';


// 头部组件
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const pageData = usePageData();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navItems = pageData.siteData?.themeConfig?.nav || [];

  return (
    <header className="header">
      <div className="header-container">
        {/* 左侧 Logo 区域 */}
        <div className="header-left">
          <a href="/" className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 7h8M8 12h8M8 17h6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span className="logo-text">TanStack Table</span>
          </a>
          
          {/* 搜索框 */}
          <div className="search-container">
            <div className="search-input">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input 
                type="text" 
                placeholder="搜索文档..." 
                className="search-field"
              />
              <kbd className="search-kbd">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* 右侧导航区域 */}
        <div className="header-right">
          {/* 桌面端导航 */}
          <nav className="desktop-nav">
            {navItems.map((item: any, index: number) => (
              <div key={index} className="nav-item">
                {item.items ? (
                  <div className="nav-dropdown">
                    <button className="nav-dropdown-trigger">
                      {item.text}
                      <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    <div className="nav-dropdown-content">
                      {item.items.map((subItem: any, subIndex: number) => (
                        <a key={subIndex} href={subItem.link} className="nav-dropdown-item">
                          {subItem.text}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a href={item.link} className="nav-link">
                    {item.text}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* 工具按钮 */}
          <div className="header-tools">
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </button>
            
            <a href="https://github.com/TanStack/table" className="github-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>

          {/* 移动端菜单按钮 */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {isMenuOpen && (
        <div className="mobile-nav">
          {navItems.map((item: any, index: number) => (
            <div key={index} className="mobile-nav-item">
              {item.items ? (
                <div>
                  <div className="mobile-nav-title">{item.text}</div>
                  {item.items.map((subItem: any, subIndex: number) => (
                    <a key={subIndex} href={subItem.link} className="mobile-nav-link">
                      {subItem.text}
                    </a>
                  ))}
                </div>
              ) : (
                <a href={item.link} className="mobile-nav-link">
                  {item.text}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

// 侧边栏组件
const Sidebar = ({ items }: { items: any[] }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const location = useLocation();

  const toggleItem = (itemText: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemText)) {
      newOpenItems.delete(itemText);
    } else {
      newOpenItems.add(itemText);
    }
    setOpenItems(newOpenItems);
  };

  const renderSidebarItem = (item: any, level = 0) => {
    const hasChildren = item.items && item.items.length > 0;
    const isOpen = openItems.has(item.text);
    const isActive = location.pathname === item.link;

    return (
      <div key={item.text || item.link} className={`sidebar-item level-${level}`}>
        {hasChildren ? (
          <div>
            <button 
              className={`sidebar-item-trigger ${isOpen ? 'open' : ''}`}
              onClick={() => toggleItem(item.text)}
            >
              <span>{item.text}</span>
              <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            {isOpen && (
              <div className="sidebar-submenu">
                {item.items.map((subItem: any) => renderSidebarItem(subItem, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <a 
            href={item.link} 
            className={`sidebar-link ${isActive ? 'active' : ''}`}
          >
            {item.text}
          </a>
        )}
      </div>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {items.map(item => renderSidebarItem(item))}
      </div>
    </aside>
  );
};

// 右侧辅助栏组件
const Aside = () => {
  const [headings, setHeadings] = useState<any[]>([]);

  useEffect(() => {
    // 获取页面标题用于目录
    const updateHeadings = () => {
      const headingElements = document.querySelectorAll('h2, h3, h4');
      const headingList = Array.from(headingElements).map((heading) => ({
        id: heading.id,
        text: heading.textContent,
        level: parseInt(heading.tagName.charAt(1))
      }));
      setHeadings(headingList);
    };

    // 延迟执行以确保内容已渲染
    setTimeout(updateHeadings, 100);
    
    // 监听路由变化
    const observer = new MutationObserver(updateHeadings);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="aside">
      {/* 页面目录 */}
      {headings.length > 0 && (
        <div className="toc">
          <h4 className="toc-title">页面导航</h4>
          <nav className="toc-nav">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`toc-link level-${heading.level}`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* 社区链接 */}
      <div className="community-links">
        <h4 className="community-title">社区</h4>
        <div className="community-items">
          <a href="https://github.com/TanStack/table" className="community-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://discord.gg/WrRKjPJ" className="community-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
            </svg>
            Discord
          </a>
        </div>
      </div>
    </aside>
  );
};

// 首页组件
const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🚀 强大的表格解决方案</span>
          </div>
          <h1 className="hero-title">
            构建高性能的
            <span className="gradient-text">数据表格</span>
          </h1>
          <p className="hero-description">
            TanStack Table 是一个无头的、TypeScript 优先的表格库，
            为所有框架提供强大的数据网格体验。
          </p>
          <div className="hero-actions">
            <a href="/guide/features" className="btn btn-primary">
              开始使用
            </a>
            <a href="https://github.com/TanStack/table" className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="demo-table">
            <div className="table-header">
              <div className="header-cell">姓名</div>
              <div className="header-cell">年龄</div>
              <div className="header-cell">邮箱</div>
              <div className="header-cell">状态</div>
            </div>
            <div className="table-body">
              <div className="table-row">
                <div className="table-cell">张三</div>
                <div className="table-cell">28</div>
                <div className="table-cell">zhang@example.com</div>
                <div className="table-cell">
                  <span className="status active">活跃</span>
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell">李四</div>
                <div className="table-cell">32</div>
                <div className="table-cell">li@example.com</div>
                <div className="table-cell">
                  <span className="status pending">待定</span>
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell">王五</div>
                <div className="table-cell">25</div>
                <div className="table-cell">wang@example.com</div>
                <div className="table-cell">
                  <span className="status active">活跃</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features">
        <div className="features-header">
          <h2>为什么选择 TanStack Table？</h2>
          <p>现代化的表格解决方案，满足各种复杂需求</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>高性能</h3>
            <p>虚拟化支持，轻松处理百万级数据</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>类型安全</h3>
            <p>完整的 TypeScript 支持，开发体验更佳</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>高度可定制</h3>
            <p>无头设计，完全控制 UI 呈现</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>框架无关</h3>
            <p>支持 React、Vue、Angular 等所有主流框架</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>功能丰富</h3>
            <p>排序、过滤、分页、分组等开箱即用</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>主题友好</h3>
            <p>轻松集成各种 UI 库和设计系统</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// 文档页面组件
const DocPage = () => {
  const pageData = usePageData();
  const location = useLocation();
  
  // 获取当前页面对应的侧边栏配置
  const getSidebarItems = () => {
    const themeConfig = pageData.siteData?.themeConfig;
    if (!themeConfig?.sidebar) return [];
    
    // 根据当前路径匹配侧边栏配置
    const path = location.pathname;
    const sidebarConfig = themeConfig.sidebar;
    
    for (const [pattern, items] of Object.entries(sidebarConfig)) {
      if (path.startsWith(pattern) || pattern === '/') {
        return items as any[];
      }
    }
    
    return [];
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="doc-page">
      {/* 侧边栏 */}
      {sidebarItems.length > 0 && <Sidebar items={sidebarItems} />}
      
      {/* 主内容区 */}
      <main className="doc-main">
        <div className="doc-content">
          {/* 面包屑导航 */}
          <div className="breadcrumb">
            <a href="/">首页</a>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{pageData.title}</span>
          </div>
          
          {/* 文档内容 */}
          <article className="prose">
            <Content />
          </article>
          
          {/* 页面导航 */}
          <div className="doc-footer">
            <div className="doc-updated">
              最后更新时间: {new Date().toLocaleDateString('zh-CN')}
            </div>
            <a href={`https://github.com/TanStack/table/edit/main/docs${location.pathname}.md`} className="edit-link">
              在 GitHub 上编辑此页
            </a>
          </div>
        </div>
      </main>
      
      {/* 右侧辅助栏 */}
      <Aside />
    </div>
  );
};

// 主布局组件
const Layout = () => {
  const pageData = usePageData();
  const isHomePage = pageData.frontmatter?.pageType === 'home';

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        {isHomePage ? <HomePage /> : <DocPage />}
      </div>
    </div>
  );
};

// 初始化函数
const setup = () => {
  if (typeof window !== 'undefined') {
    // 主题初始化
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // 触发搜索
        const searchInput = document.querySelector('.search-field') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }
};

export { Layout, setup };
