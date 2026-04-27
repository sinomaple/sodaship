# SodaShip Project Guidance

## Goal
SodaShip is a playful static website for Lillian's knitted hobby products.

## Brand
- Store name: SodaShip
- Creator: Lillian
- Contact email: Lillian@sodaship.com
- Website: www.sodaship.com
- Tagline direction: knitted by Lillian

## Style
- Make the site feel like a cheerful 10-year-old made it with care.
- Prefer bright pastel colors, playful shapes, simple language, and a handmade school-project feeling.
- Keep edits small and easy to understand.
- Avoid making the site look too polished, corporate, or like a generic ecommerce template.

## Technical Notes
- This is a static GitHub Pages site.
- Use plain HTML, CSS, JavaScript, and SVG.
- Keep links and assets relative so they work on GitHub Pages.
- The custom domain is set in `CNAME`.
- The logo lives in `logo.svg`; HTML pages reference it with `logo.svg?v=2` to avoid stale browser cache.

## Important Files
- `index.html`: home page
- `products.html`: product list
- `about.html`: creator/about page
- `contact.html`: contact information
- `styles.css`: shared site styling
- `logo.svg`: SodaShip logo artwork
- `script.js`: small shared JavaScript

## Workflow
- Before editing, inspect the current file so recent changes are preserved.
- Do not remove user-made edits unless explicitly asked.
- When changing any page header, compare it against `index.html` and keep the header markup, navigation links, logo reference, and shared logo sizing consistent across all pages.
- After changing logo references or assets, check every page still points to the correct relative path.
- For GitHub Pages issues, verify that changed files are committed and pushed to `main`.

## Mermaid Preview Test Snippets
These snippets are for testing which Mermaid diagram types render in the current Markdown preview. Some preview extensions may not support every Mermaid beta diagram type yet.

### Flowchart
```mermaid
flowchart TD
    A[Open SodaShip] --> B{Pick a page}
    B --> C[Products]
    B --> D[About]
    B --> E[Contact]
```

### Sequence Diagram
```mermaid
sequenceDiagram
    participant Shopper
    participant Store
    Shopper->>Store: Open homepage
    Store-->>Shopper: Show knitted things
```

### Class Diagram
```mermaid
classDiagram
    class Product {
        +string name
        +string description
    }
    class Storefront
    Storefront --> Product
```

### State Diagram
```mermaid
stateDiagram-v2
    [*] --> Browsing
    Browsing --> PickingGift
    PickingGift --> Contacting
    Contacting --> [*]
```

### Entity Relationship Diagram
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ PRODUCT : includes
    PRODUCT {
        string name
        string color
    }
```

### User Journey
```mermaid
journey
    title SodaShip visit
    section Browse
      Open home page: 5: Shopper
      Read products: 4: Shopper
    section Contact
      Send email: 5: Shopper
```

### Gantt
```mermaid
gantt
    title SodaShip mini plan
    dateFormat YYYY-MM-DD
    section Site
    Polish homepage :done, 2026-04-01, 3d
    Add product photos :active, 2026-04-04, 5d
```

### Pie Chart
```mermaid
pie title Favorite handmade things
    "Scarves" : 40
    "Neckwarmers" : 35
    "Sunglasses bags" : 25
```

### Quadrant Chart
```mermaid
quadrantChart
    title Product ideas
    x-axis Easy --> Hard
    y-axis Plain --> Fancy
    quadrant-1 Big project
    quadrant-2 Quick win
    quadrant-3 Maybe later
    quadrant-4 Practice
    Neckwarmer: [0.3, 0.7]
    Tiny bag: [0.2, 0.5]
```

### Requirement Diagram
```mermaid
requirementDiagram
    requirement cute_site {
        id: 1
        text: The site should feel cheerful and handmade.
        risk: low
        verifymethod: inspection
    }

    element homepage {
        type: page
    }

    homepage - satisfies -> cute_site
```

### GitGraph
```mermaid
gitGraph
    commit id: "start"
    branch polish
    checkout polish
    commit id: "header"
    checkout main
    merge polish
```

### C4 Diagram
```mermaid
C4Context
    title SodaShip context
    Person(shopper, "Shopper", "Looks for handmade gifts")
    System(site, "SodaShip", "Static storefront")
    Rel(shopper, site, "Visits")
```

### Mindmap
```mermaid
mindmap
  root((SodaShip))
    Pages
      Home
      Products
      About
      Contact
    Style
      Pastel
      Handmade
```

### Timeline
```mermaid
timeline
    title SodaShip timeline
    2026 : Create site
         : Add products
         : Add secret surprise
```

### ZenUML
```mermaid
zenuml
    title SodaShip browse
    Lillian->Store: Adds products
    Shopper->Store: Browses products
```

### Sankey
```mermaid
sankey-beta
    Homepage,Products,8
    Products,Contact,3
    Homepage,About,2
```

### XY Chart
```mermaid
xychart-beta
    title "SodaShip products"
    x-axis [Scarves, Neckwarmers, Bags]
    y-axis "Count" 0 --> 10
    bar [4, 7, 5]
```

### Block Diagram
```mermaid
block-beta
    columns 3
    logo["Logo"] nav["Nav"] pages["Pages"]
    logo --> nav
    nav --> pages
```

### Packet
```mermaid
packet-beta
    title SodaShip packet
    0-15: "Product ID"
    16-31: "Gift Note"
    32-63: "Yarn Color"
```

### Kanban
```mermaid
kanban
    todo[Todo]
        task1[Add product photo]
    doing[Doing]
        task2[Test preview]
    done[Done]
        task3[Header cleanup]
```

### Architecture
```mermaid
architecture-beta
    group site(cloud)[SodaShip site]
    service pages(server)[HTML pages] in site
    service assets(disk)[CSS and SVG assets] in site
    pages:R --> L:assets
```

### Radar
```mermaid
radar-beta
    title SodaShip style
    axis cute, simple, colorful, handmade
    curve site{9, 8, 10, 9}
```

### Treemap
```mermaid
treemap-beta
    "SodaShip"
        "Pages"
            "Home": 1
            "Products": 1
            "About": 1
            "Contact": 1
        "Assets"
            "Logo": 1
            "Styles": 1
```

### Venn
```mermaid
venn-beta
    set Makers
    set Shoppers
    union Makers,Shoppers
```

### Ishikawa
```mermaid
ishikawa
    Cheerful storefront
        Style
            Pastel colors
            Playful shapes
        Content
            Simple words
            Handmade products
```

### TreeView
```mermaid
treeView-beta
    "1_sodaship_storefront"
        "index.html"
        "products.html"
        "about.html"
        "contact.html"
        "styles.css"
        "script.js"
```
