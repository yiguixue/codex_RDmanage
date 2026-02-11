import type { ReactNode } from "react";

type MenuNode = {
  key: string;
  label: string;
  children?: MenuNode[];
};

type DraggingMenu = {
  key: string;
  parentKey?: string;
} | null;

type MenusPageProps = {
  menuConfig: MenuNode[];
  dragOverMenu: string | null;
  setDragOverMenu: (value: string | null) => void;
  setDraggingMenu: (value: DraggingMenu) => void;
  handleMenuDrop: (targetKey: string, parentKey?: string) => void;
  openMenuEdit: (menu: MenuNode, parentKey?: string) => void;
  renderMenuIcon: (menu: MenuNode) => ReactNode;
  gripIcon: ReactNode;
};

export function MenusPage({
  menuConfig,
  dragOverMenu,
  setDragOverMenu,
  setDraggingMenu,
  handleMenuDrop,
  openMenuEdit,
  renderMenuIcon,
  gripIcon
}: MenusPageProps) {
  return (
    <section className="section-block">
      <div className="card menu-panel">
        <div className="menu-list">
          {menuConfig.map((menu) => {
            const isSystemGroup = Boolean(menu.children && menu.children.length > 0);
            return (
              <div key={menu.key} className="menu-group">
                <div
                  className={`menu-row ${dragOverMenu === menu.key ? "drag-over" : ""}`}
                  draggable
                  onDragStart={() => setDraggingMenu({ key: menu.key })}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverMenu(menu.key);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleMenuDrop(menu.key);
                  }}
                  onDragEnd={() => {
                    setDraggingMenu(null);
                    setDragOverMenu(null);
                  }}
                  onClick={() => openMenuEdit(menu)}
                >
                  <span className="drag-handle">{gripIcon}</span>
                  <span className="menu-icon">{renderMenuIcon(menu)}</span>
                  <div className="menu-name">{menu.label}</div>
                  <span className="menu-meta">编辑</span>
                </div>
                {isSystemGroup && (
                  <div className="menu-group-block">
                    <div className="menu-sublist">
                      {menu.children?.map((child) => (
                        <div
                          key={child.key}
                          className={`menu-row sub ${dragOverMenu === child.key ? "drag-over" : ""}`}
                          draggable
                          onDragStart={() => setDraggingMenu({ key: child.key, parentKey: menu.key })}
                          onDragOver={(event) => {
                            event.preventDefault();
                            setDragOverMenu(child.key);
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleMenuDrop(child.key, menu.key);
                          }}
                          onDragEnd={() => {
                            setDraggingMenu(null);
                            setDragOverMenu(null);
                          }}
                          onClick={() => openMenuEdit(child, menu.key)}
                        >
                          <span className="drag-handle">{gripIcon}</span>
                          <span className="menu-icon">{renderMenuIcon(child)}</span>
                          <div className="menu-name">{child.label}</div>
                          <span className="menu-meta">编辑</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
