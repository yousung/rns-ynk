# Graph Report - .  (2026-05-22)

## Corpus Check
- Corpus is ~32,905 words - fits in a single context window. You may not need a graph.

## Summary
- 144 nodes · 155 edges · 38 communities detected
- Extraction: 62% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Warehouse Operations & FIFO|Warehouse Operations & FIFO]]
- [[_COMMUNITY_App Navigation & Page Routing|App Navigation & Page Routing]]
- [[_COMMUNITY_Marketing Presentation|Marketing Presentation]]
- [[_COMMUNITY_Warehouse Elevation View|Warehouse Elevation View]]
- [[_COMMUNITY_Kiosk Interface|Kiosk Interface]]
- [[_COMMUNITY_Floor Plan View|Floor Plan View]]
- [[_COMMUNITY_Minimap Navigation|Minimap Navigation]]
- [[_COMMUNITY_Activity Log|Activity Log]]
- [[_COMMUNITY_App Entry & Auth Guard|App Entry & Auth Guard]]
- [[_COMMUNITY_Cell Detail Panel|Cell Detail Panel]]
- [[_COMMUNITY_Warehouse Matrix Grid|Warehouse Matrix Grid]]
- [[_COMMUNITY_Dashboard & KPIs|Dashboard & KPIs]]
- [[_COMMUNITY_Platform Selection|Platform Selection]]
- [[_COMMUNITY_App Layout Shell|App Layout Shell]]
- [[_COMMUNITY_Sidebar Navigation|Sidebar Navigation]]
- [[_COMMUNITY_Schedule Scroll|Schedule Scroll]]
- [[_COMMUNITY_Rack Grid|Rack Grid]]
- [[_COMMUNITY_Warehouse Tabs|Warehouse Tabs]]
- [[_COMMUNITY_Stats Bar|Stats Bar]]
- [[_COMMUNITY_Mini Blocks|Mini Blocks]]
- [[_COMMUNITY_User Management|User Management]]
- [[_COMMUNITY_Product Catalog|Product Catalog]]
- [[_COMMUNITY_Inbound Execution|Inbound Execution]]
- [[_COMMUNITY_Login & Auth|Login & Auth]]
- [[_COMMUNITY_Outbound Schedule|Outbound Schedule]]
- [[_COMMUNITY_Inventory Page|Inventory Page]]
- [[_COMMUNITY_Settings|Settings]]
- [[_COMMUNITY_Inbound Schedule|Inbound Schedule]]
- [[_COMMUNITY_Outbound Execution|Outbound Execution]]
- [[_COMMUNITY_Tablet Outbound|Tablet Outbound]]
- [[_COMMUNITY_Tablet Inbound|Tablet Inbound]]
- [[_COMMUNITY_Auth Store|Auth Store]]
- [[_COMMUNITY_UI Theme Store|UI Theme Store]]
- [[_COMMUNITY_App Bootstrap|App Bootstrap]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Main Entry|Main Entry]]
- [[_COMMUNITY_Data Store|Data Store]]
- [[_COMMUNITY_Presentation Node|Presentation Node]]

## God Nodes (most connected - your core abstractions)
1. `Layout()` - 3 edges
2. `KioskPage()` - 3 edges
3. `getFloorY()` - 2 edges
4. `WarehouseElevation()` - 2 edges
5. `fmtDate()` - 2 edges
6. `ActivityLog()` - 2 edges
7. `fmtTime()` - 2 edges
8. `fmtDate()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Hyperedges (group relationships)
- **Warehouse Visualization Components** — warehouse_tabs, warehouse_rackgrid, warehouse_celldetails, warehouse_elevation, warehouse_matrix, warehouse_floorplan, warehouse_statsbar, warehouse_minimap, warehouse_miniblocks [INFERRED 0.85]
- **Page Components** — pages_dashboard, pages_inbound_execute, pages_outbound_execute, pages_inbound_schedule, pages_outbound_schedule, pages_users, pages_activitylog, pages_products [INFERRED 0.90]
- **Inbound/Outbound Processing Flow** — pages_inbound_schedule, pages_inbound_execute, pages_outbound_schedule, pages_outbound_execute [INFERRED 0.85]
- **** — outbound_execute, warehouse_matrix, fifo_logic [0.95]
- **** — inbound_execute, warehouse_visualization, inventory_item [0.9]
- **** — inventory, warehouse_type_a, warehouse_type_b [0.85]
- **** — use_auth_store, use_ui_store, use_data_store [1.0]
- **** — platform_web, platform_tablet, platform_kiosk [0.95]
- **** — warehouse_type_a, warehouse_type_b, inbound_scheduling, outbound_scheduling [0.85]
- **** — outbound_execute, tablet_outbound, platform_tablet, platform_web [0.8]
- **** — inbound_execute, tablet_inbound, platform_tablet, platform_web [0.8]
- **** — fifo_logic, outbound_execute, inventory_tracking, pallet [0.9]
- **** — inventory, warehouse_visualization, rack, pallet, inventory_item [0.95]
- **** — use_ui_store, platform_select, outbound_execute, inbound_execute [0.85]
- **** — use_data_store, inventory_item, pallet, rack [1.0]

## Communities

### Community 0 - "Warehouse Operations & FIFO"
Cohesion: 0.11
Nodes (25): FIFO Logic, InboundExecute, Inbound Scheduling, Inventory, Inventory Item, Inventory Tracking, KioskPage, Login (+17 more)

### Community 1 - "App Navigation & Page Routing"
Cohesion: 0.29
Nodes (0): 

### Community 2 - "Marketing Presentation"
Cohesion: 0.12
Nodes (0): 

### Community 3 - "Warehouse Elevation View"
Cohesion: 0.5
Nodes (2): getFloorY(), WarehouseElevation()

### Community 4 - "Kiosk Interface"
Cohesion: 0.6
Nodes (3): fmtDate(), fmtTime(), KioskPage()

### Community 5 - "Floor Plan View"
Cohesion: 0.5
Nodes (0): 

### Community 6 - "Minimap Navigation"
Cohesion: 0.5
Nodes (0): 

### Community 7 - "Activity Log"
Cohesion: 0.67
Nodes (2): ActivityLog(), fmtDate()

### Community 8 - "App Entry & Auth Guard"
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Cell Detail Panel"
Cohesion: 0.67
Nodes (0): 

### Community 10 - "Warehouse Matrix Grid"
Cohesion: 0.67
Nodes (0): 

### Community 11 - "Dashboard & KPIs"
Cohesion: 0.67
Nodes (0): 

### Community 12 - "Platform Selection"
Cohesion: 0.67
Nodes (0): 

### Community 13 - "App Layout Shell"
Cohesion: 0.67
Nodes (1): Layout()

### Community 14 - "Sidebar Navigation"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Schedule Scroll"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Rack Grid"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Warehouse Tabs"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Stats Bar"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Mini Blocks"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "User Management"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Product Catalog"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Inbound Execution"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Login & Auth"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Outbound Schedule"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Inventory Page"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Settings"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Inbound Schedule"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Outbound Execution"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Tablet Outbound"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Tablet Inbound"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Auth Store"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "UI Theme Store"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "App Bootstrap"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Main Entry"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Data Store"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Presentation Node"
Cohesion: 1.0
Nodes (1): Presentation

## Knowledge Gaps
- **Thin community `Sidebar Navigation`** (2 nodes): `Sidebar()`, `Sidebar.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Schedule Scroll`** (2 nodes): `ScheduleScroll()`, `ScheduleScroll.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rack Grid`** (2 nodes): `WarehouseRackGrid.jsx`, `WarehouseRackGrid()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Warehouse Tabs`** (2 nodes): `WarehouseTabs.jsx`, `WarehouseTabs()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stats Bar`** (2 nodes): `StatsBar.jsx`, `StatsBar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mini Blocks`** (2 nodes): `MiniBlocks()`, `MiniBlocks.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Management`** (2 nodes): `Users.jsx`, `Users()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Catalog`** (2 nodes): `Products()`, `Products.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Inbound Execution`** (2 nodes): `InboundExecute()`, `InboundExecute.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login & Auth`** (2 nodes): `Login()`, `Login.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Outbound Schedule`** (2 nodes): `OutboundSchedule()`, `OutboundSchedule.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Inventory Page`** (2 nodes): `Inventory()`, `Inventory.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Settings`** (2 nodes): `Settings()`, `Settings.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Inbound Schedule`** (2 nodes): `InboundSchedule()`, `InboundSchedule.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Outbound Execution`** (2 nodes): `OutboundExecute()`, `OutboundExecute.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tablet Outbound`** (2 nodes): `TabletOutbound.jsx`, `TabletOutbound()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tablet Inbound`** (2 nodes): `TabletInbound.jsx`, `TabletInbound()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Store`** (2 nodes): `useAuthStore.js`, `loadUser()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Theme Store`** (2 nodes): `useUIStore.js`, `applyTheme()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Bootstrap`** (2 nodes): `main.jsx`, `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Main Entry`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Store`** (1 nodes): `useDataStore.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Presentation Node`** (1 nodes): `Presentation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Layout()` connect `App Layout Shell` to `App Navigation & Page Routing`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Should `Warehouse Operations & FIFO` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Marketing Presentation` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._