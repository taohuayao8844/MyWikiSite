import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import DocSidebar from '@theme-original/DocSidebar';

function useIsMobileViewport(breakpoint = 996) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const updateViewportState = (event) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(mediaQueryList.matches);

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updateViewportState);
      return () => mediaQueryList.removeEventListener('change', updateViewportState);
    }

    mediaQueryList.addListener(updateViewportState);
    return () => mediaQueryList.removeListener(updateViewportState);
  }, [breakpoint]);

  return isMobileViewport;
}

export default function DocSidebarWrapper(props) {
  const isMobileViewport = useIsMobileViewport();
  const location = useLocation();
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
  const isDocumentLikePage = location.pathname !== '/bookmarks' && location.pathname !== '/friends';
  const hasSidebarItems = Array.isArray(props.items) && props.items.length > 0;
  const shouldRenderMobileSidebarControls = isDocumentLikePage && hasSidebarItems;

  useEffect(() => {
    if (!isMobileViewport && isSidebarDrawerOpen) {
      setIsSidebarDrawerOpen(false);
    }
  }, [isMobileViewport, isSidebarDrawerOpen]);

  useEffect(() => {
    if (isSidebarDrawerOpen) {
      setIsSidebarDrawerOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    document.body.classList.toggle(
      'mobile-doc-sidebar-open',
      isMobileViewport && isSidebarDrawerOpen && shouldRenderMobileSidebarControls
    );

    return () => {
      document.body.classList.remove('mobile-doc-sidebar-open');
    };
  }, [isMobileViewport, isSidebarDrawerOpen]);

  const drawerClassName = useMemo(() => {
    return [
      'mobile-doc-sidebar-shell',
      isMobileViewport && shouldRenderMobileSidebarControls ? 'mobile-doc-sidebar-shell--mobile' : '',
      isSidebarDrawerOpen && shouldRenderMobileSidebarControls ? 'mobile-doc-sidebar-shell--open' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }, [isMobileViewport, isSidebarDrawerOpen, shouldRenderMobileSidebarControls]);

  const handleDrawerToggle = () => {
    setIsSidebarDrawerOpen((previousState) => !previousState);
  };

  const handleDrawerClose = () => {
    setIsSidebarDrawerOpen(false);
  };

  const handleSidebarClick = (event) => {
    const targetElement = event.target;

    if (!(targetElement instanceof HTMLElement)) {
      return;
    }

    const sublistToggleElement = targetElement.closest(
      '.menu__link--sublist, .menu__link--sublist-caret, .menu__caret, .menu__list-item-collapsible'
    );

    if (sublistToggleElement) {
      return;
    }

    const navigationLinkElement = targetElement.closest('a[href]');

    if (!(navigationLinkElement instanceof HTMLAnchorElement)) {
      return;
    }

    const hrefAttribute = navigationLinkElement.getAttribute('href');
    const isExpandableCategoryToggle = hrefAttribute === '#' || hrefAttribute === '';

    if (isExpandableCategoryToggle) {
      return;
    }

    if (isMobileViewport) {
      setIsSidebarDrawerOpen(false);
    }
  };

  return (
    <>
      {isMobileViewport && shouldRenderMobileSidebarControls && (
        <>
          <button
            type="button"
            className="mobile-doc-sidebar-fab"
            aria-label={isSidebarDrawerOpen ? '关闭文章目录' : '打开文章目录'}
            aria-expanded={isSidebarDrawerOpen}
            onClick={handleDrawerToggle}
          >
            <span className="mobile-doc-sidebar-fab__icon" aria-hidden="true">
              {isSidebarDrawerOpen ? '×' : '☰'}
            </span>
            <span className="mobile-doc-sidebar-fab__label">文章目录</span>
          </button>

          <button
            type="button"
            className={`mobile-doc-sidebar-backdrop ${isSidebarDrawerOpen ? 'mobile-doc-sidebar-backdrop--visible' : ''}`}
            aria-label="关闭文章目录遮罩"
            onClick={handleDrawerClose}
          />
        </>
      )}

      <div className={drawerClassName} onClick={handleSidebarClick}>
        <DocSidebar {...props} />
      </div>
    </>
  );
}
