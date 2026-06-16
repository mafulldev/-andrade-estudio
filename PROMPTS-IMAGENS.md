# Prompts de imagem — ANDRADE, Estúdio digital + demos

Documento para gerar, com IA, **todas as imagens fotográficas** do site e dos 5
demos, em 8K e altíssima qualidade, todas dentro de uma mesma direção de arte
(grafite frio, marfim como luz, âmbar pontual rarissimo). São **44 imagens**.

> **NeuroCode fica de fora.** O case real NeuroCode AI e toda a arte vetorial
> autoral do estúdio (as 5 capas em `/public/modelos/*.svg`, a assinatura
> `AssinaturaAndrade`, o `selftest-terminal.svg`, o `icon.svg`) **não devem ser
> gerados por IA** — já são arte própria e correta.

---

## Como usar (leia antes)

**Cada prompt = PREÂMBULO + ` :: ` + a CENA da imagem.** O preâmbulo (seção 0)
é o mesmo em todas; cole-o no início e depois a cena específica de cada imagem.
O ` :: ` é separador de peso (Midjourney); em Flux/DALL-E/Ideogram pode juntar
tudo num parágrafo só.

1. **Proporção:** cada imagem tem a sua (ex.: `--ar 4:5`). Respeite — o layout
   recorta nessa proporção.
2. **8K:** todo prompt já pede 8K. Se a sua ferramenta não entrega 8K nativo,
   gere no máximo dela e **dê upscale** depois (upscaler da própria ferramenta,
   Topaz, Magnific etc.) até ~7680px no maior lado.
3. **Negativo:** use o **prompt negativo universal** (seção 0b) no campo de
   negativos; no Midjourney, coloque após `--no`. Onde houver negativo extra,
   está anotado na imagem.
4. **Coerência:** gere a série inteira na **mesma ferramenta, mesmo modelo e
   mesmos ajustes** — elas precisam parecer saídas do mesmo ensaio.
5. **Sem texto:** nenhuma imagem deve conter letras/logos. O texto do site é
   sobreposto por cima, em HTML.

**Depois de gerar:** salve com o nome de arquivo indicado em cada item. Os
demos hoje usam imagens temporárias (placeholders `picsum.photos`) e a home
aponta para `.avif` que ainda não existem; **trocar os caminhos no código por
esses arquivos é um passo à parte** — me peça que eu faço a fiação (inclusive os
casos do Brasa em que a mesma imagem temporária é reusada em dois contextos e
precisa virar arquivos separados).

---

## 0. PREÂMBULO de estilo (cole no início de TODO prompt)

```
Editorial cinematic minimalism, fine-art photography aesthetic. Muted, near-monochromatic palette of cold graphite (blue-grey, hue ~240-245) and soft ivory light. Generous negative space, a single clear subject, calm balanced composition. Soft directional light from one lateral or diagonal source, long gentle shadows, controlled penumbra, subtle corner vignette. A single, extremely rare warm amber accent (#D8A05E) as a small pinpoint highlight only, never large areas, never dominant; when in doubt, omit it. Low-to-medium exposure, dessaturated, restrained, luxurious through quietness. Fine analog film grain, subtle texture, no plastic digital cleanliness. Noble sober materials (concrete, glass, brushed metal, paper, skin in half-light). Nocturnal studio atmosphere, sophisticated and serene. No text, no letters, no logos, no watermarks, no UI. Photographic, understated, gallery-grade. ::
```

## 0b. Prompt NEGATIVO universal (cole no campo de negativos / após `--no`)

```
text, letters, words, logos, brand marks, watermark, signature, UI, screen mockups, oversaturated colors, neon, rainbow gradients, any warm color other than the single tiny amber accent, stock-photo cliche, posed smiling people, corporate handshake, thumbs up, plastic AI skin, excessive bloom, exaggerated bokeh, deformed hands, deformed fingers, extra limbs, melted faces, asymmetric eyes, hard flash, blown highlights, aggressive HDR, over-sharpening halos, glossy 3D render, pure white background, bright sunny cheerful scene, collage, frames, borders, cartoon, illustration, emoji, neural-network or node-graph diagram
```

## 0c. Paleta de referência (para ajuste de cor pós-geração)

| Token | Hex aprox. | Papel na imagem |
|---|---|---|
| Grafite base | `#191B1E` | fundo dominante, frio azulado |
| Grafite profundo | `#101214` | sombras, cantos, vinheta |
| Marfim / luz | `#E8E9EA` | luz principal, nunca branco estourado |
| Cinza mudo | `#9CA0A4` | meios-tons, neblina |
| **Âmbar** | **`#D8A05E`** | **único calor, 1-3% do quadro** |

---

# 1. HOME — estúdio ANDRADE
Salvar em `/public/fotos/`. Tema: o estúdio à noite, o processo, a mão que constrói.

### 1.1 · `processo-01.avif` · **4:5** (`--ar 4:5`)
**Mostra:** a pena de uma caneta-tinteiro tocando o papel — o gesto inicial do briefing.
> Extreme close-up of the nib of a fountain pen just touching a sheet of fine textured ivory paper in darkness, the very first stroke of ink about to be drawn, a faint glistening ink meniscus at the nib tip catching one tiny pinpoint of warm amber light. Vertical 4:5 portrait composition, the pen entering diagonally from upper right, vast quiet graphite negative space around it, shallow depth of field, soft side light grazing the paper grain. Hand only barely implied, out of frame. Ultra high detail, 8K, professional macro photography.

### 1.2 · `processo-02.avif` · **4:5** (`--ar 4:5`)
**Mostra:** mãos desenhando a lápis sobre prancheta com régua de escala — o briefing/proposta.
> A pair of hands in half-light drawing fine hairline pencil lines on a sheet of paper over a drafting board, a triangular architect's scale ruler resting beside them, the hands precise and calm. Vertical 4:5 portrait composition, top-down three-quarter angle, soft directional light raking across the paper from the left, deep graphite shadows in the corners, vast negative space, brushed metal of the ruler catching a single faint cool reflection. Realistic skin in penumbra, no faces. Ultra high detail, 8K, professional photography.

### 1.3 · `processo-03.avif` · **4:5** (`--ar 4:5`)
**Mostra:** mão num teclado escuro, duas teclas com leve halo âmbar — a construção (design + código).
> Close-up of a single hand resting on a dark brushed-aluminium mechanical keyboard at night, the keycaps in deep graphite, exactly two adjacent keys glowing with a faint warm amber backlight as the only point of warmth in the frame. Vertical 4:5 portrait composition, low-angle three-quarter view along the key rows, soft cool directional light from the upper left, blurred graphite darkness beyond, generous negative space, fine film grain. Realistic skin in penumbra, blank unmarked keycaps. Ultra high detail, 8K, professional photography.
> _Negativo extra: no readable key legends, no RGB keyboard, no rainbow backlight._

### 1.4 · `processo-04.avif` · **4:5** (`--ar 4:5`)
**Mostra:** mesa à noite com luminária acesa e monitor — a entrega/estreia.
> A quiet desk at night seen from a low three-quarter angle: a single slim desk lamp casting a small contained pool of warm amber light over a graphite surface, the dark silhouette of a thin monitor with a blank neutral-grey screen beside it. Vertical 4:5 portrait composition, mostly enveloped in cold graphite darkness, the lamp glow as the only warmth occupying a tiny fraction of the frame, deep vignette, vast negative space, fine analog grain. Ultra high detail, 8K, professional photography.

### 1.5 · `estudio-faixa.avif` · **21:9** (`--ar 21:9`)
**Mostra:** a bancada de trabalho à noite, panorâmica — "A bancada, tarde da noite".
> An ultra-wide cinematic panorama of a long working bench late at night: a dark concrete-and-wood worktable with a few sober tools laid out, sheets of paper, a pencil, a closed laptop, a brushed-metal scale ruler, lit by a single small desk lamp pooling faint warm amber light at one side. Wide 21:9 letterbox composition, camera low and parallel to the bench, the lamp glow occupying a tiny fraction of the right third, the rest dissolving into cold graphite penumbra and deep corner vignette, enormous calm negative space above. Fine analog film grain. Ultra high detail, 8K, professional architectural photography.

### 1.6 · `bastidores-codigo.avif` · **16:10** (`--ar 16:10`)
**Mostra:** tela de código abstrata, sem texto legível — a prova de engenharia.
> An extreme shallow-depth-of-field macro of a dark monitor at an oblique angle, rows of code suggested only as soft blurred horizontal bars of cold ivory and graphite light, no legible characters anywhere, with a single faint amber speck where a cursor might blink. Landscape 16:10 composition, the screen filling the frame diagonally, most of it falling out of focus into graphite darkness, gentle bloom on the brightest indent, fine analog film grain, deep vignette. Ultra high detail, 8K, professional macro photography.
> _Negativo extra: no readable code, no neon syntax highlighting, no rainbow text._

### 1.7 · `coda-horizonte.avif` · **21:9** (`--ar 21:9`) — **exceção do âmbar**
**Mostra:** horizonte noturno atrás do contato. É a ÚNICA imagem em que o âmbar pode ser uma faixa baixa.
> _Para esta imagem, troque a frase do âmbar no preâmbulo por:_ "As an exception for this single horizon image, a low warm amber band (#D8A05E) is permitted along the distant horizon line, still restrained, occupying only the lowest sliver of the frame, never flooding the sky."
>
> A vast nocturnal horizon seen from far away: a calm distant city skyline or mineral landscape reduced to a thin dark silhouette, with a soft low band of warm amber-gold afterglow hugging the horizon beneath an enormous cold graphite night sky fading to deep blue-grey at the top. Ultra-wide 21:9 letterbox composition, horizon placed in the lower third, immense quiet negative sky above, a few faint cool stars, gentle atmospheric haze, deep corner vignette, fine analog film grain. Ultra high detail, 8K, professional landscape photography.

### 1.8 · (OPCIONAL) fundo do cartão social e favicon
O OpenGraph (`opengraph-image`, 1200×630) e o `icon.svg` **já são gerados por
código** e estão corretos. Só gere se quiser um fundo raster atmosférico por
trás do texto (que continua sendo sobreposto):
> A 1.91:1 landscape background plate: a deep near-black warm-charcoal field (#0b0a08) with an immense calm centre of empty negative space, and a single soft warm amber radial bloom emanating from the upper-right corner, fading smoothly to darkness, gentle vignette at all corners, fine analog grain. Completely empty centre, no objects, no text. Ultra high detail, 8K, professional graphic backdrop.

---

# 2. DEMO BRASA — cozinha de fogo
Marca fictícia (fine dining, lenha de macieira, Campinas). Salvar em `/public/demos/brasa/`.
Fotografia gastronômica editorial, penumbra, brasa como único calor.

### 2.1 · `hero.avif` · **3:2** (`--ar 3:2`)
**Mostra:** prato autoral à luz do fogo, deslocado pra direita (2/3 superiores escuros pro título).
> A wide cinematic hero shot of a single plated fine-dining dish from a Brazilian wood-fire kitchen, a dark seared slow-cooked beef short rib or grilled octopus resting on a thick charred-oak table, photographed at a dim nocturnal restaurant pass. The dish sits low and to the right; the upper-left two thirds of the frame fall into deep graphite shadow as pure negative space for an overlaid headline. The only warmth is a faint amber glimmer of distant embers reflecting on the rim of the plate and on a thin film of jus. Heavy 3:2 horizontal framing, low-medium exposure, soft directional light raking from the right, smoke barely visible in the air, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.2 · `prato-1.avif` · **4:3** (`--ar 4:3`) — Pão de fermentação lenta na chapa
> An intimate close-up of a single thick slice of Brazilian slow-fermentation sourdough griddled on a hot plancha, rustic blistered crust, a pat of browned butter melting into the surface, coarse flaky sea salt scattered on top, resting on a matte dark-charcoal ceramic plate against a deep graphite tabletop. Centered single subject with quiet negative space around it, 4:3 framing, soft directional light from the upper left, the only warmth a faint amber sheen where the butter catches the light. Low exposure, dessaturated, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.3 · `prato-2.avif` · **4:3** (`--ar 4:3`) — Tartar de carne com gema curada
> A precise close-up of hand-cut beef tartare quenelle crowned with a single cured egg yolk, beside two thin slices of brioche charred on the grill and a restrained smear of malt mustard, plated on a dark slate-grey ceramic dish over a graphite table. The amber-toned cured yolk is the single small warm accent in an otherwise cold monochrome frame. 4:3 framing, single centered subject, soft raking light from one diagonal source, generous shadow, low exposure, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.4 · `prato-3.avif` · **4:3** (`--ar 4:3`) — Couve-flor inteira assada
> A single whole roasted cauliflower head, edges charred and blistered from the fire, drizzled with burnt-sesame tahine and dusted with smoked pepper, sitting in a deep dark-grey bowl on a graphite surface. The ivory-grey florets glow softly under a single diagonal light; a faint amber ember-glow grazes one charred edge as the only warm note. 4:3 framing, centered single subject, deep negative space and penumbra around it, low exposure, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.5 · `prato-4.avif` · **4:3** (`--ar 4:3`) — Polvo na grelha
> A single charred grilled octopus tentacle, its suckers marked by the grill and tips lightly blackened, laid over a halved ash-roasted potato and dusted with house paprika, plated on a dark matte stoneware dish over graphite. The cold blue-grey tones dominate; a single faint amber highlight catches the glistening char as the only warmth. 4:3 framing, centered single subject, soft directional light from one diagonal source, deep shadow and negative space, low exposure, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.6 · `prato-5.avif` · **4:3** (`--ar 4:3`) — Costela de doze horas
> A single portion of Brazilian twelve-hour slow-roasted beef short rib, the meat tender and fork-pulling apart, glazed in a dark glossy reduced jus, set beside a quenelle of pale root-vegetable puree on a dark slate plate over a graphite table. Cold monochrome ambience; the dark glaze holds one small amber catch-light from a distant flame as the only warmth. 4:3 framing, centered single subject, soft raking light from one diagonal source, generous shadow and negative space, low exposure, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.7 · `prato-6.avif` · **4:3** (`--ar 4:3`) — Pescado do dia no fogo
> A single fillet of fresh white fish grilled over fire with crisp blistered skin, resting on a pale pool of cravo-lime beurre blanc and finished with a few sprigs of garden herbs, plated in a deep dark-grey bowl over graphite. The cold ivory sauce and grey tones dominate; one faint amber glint sits on the crisp skin as the only warmth. 4:3 framing, centered single subject, soft directional light from one diagonal source, deep shadow and negative space, low exposure, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.8 · `prato-7.avif` · **4:3** (`--ar 4:3`) — Abacaxi tostado
> A dessert plate of Brazilian fire-grilled pineapple slices with caramelized charred edges, beside a clean quenelle of fresh-cheese ice cream and a thin thread of dark sugarcane molasses, on a dark matte dessert plate over graphite. Cold grey ambience keeps it restrained; the caramelized pineapple edge carries one small amber highlight as the only warmth. 4:3 framing, centered single subject, soft diagonal light, deep shadow and negative space, low exposure, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.9 · `prato-8.avif` · **4:3** (`--ar 4:3`) — Petit gâteau de chocolate
> A single dark 70% chocolate petit gateau cut open so the molten center slowly flows, dusted with flaky sea salt, beside a small pour of raw cream, on a dark matte dessert plate over a graphite surface. Deep near-black and grey tones throughout; one faint amber catch-light glints on the glossy molten chocolate as the only warmth. 4:3 framing, centered single subject, soft directional light from one diagonal source, heavy shadow and negative space, low exposure, fine film grain. Ultra high detail, 8K, professional food photography.

### 2.10 · `forno.avif` · **4:3** (`--ar 4:3`) — O forno de barro aceso
> A documentary interior of a restaurant wood-fire kitchen: an old clay-and-masonry oven, its mouth glowing with a low bed of embers and a small contained flame deep inside, surrounded by dark concrete and soot-darkened brick walls, a neat stack of apple-wood logs resting beside it. The room sits in graphite penumbra; only the oven mouth holds a small, contained amber-ember glow as the single warm accent. 4:3 framing, the oven set slightly off-center with generous dark negative space around it, soft directional light, fine film grain. Ultra high detail, 8K, professional architectural photography.
> _Negativo extra: no huge raging orange fire filling the frame, no roaring flames, no chef posing._

### 2.11 · `salao.avif` · **16:9** (`--ar 16:9`) — O salão à noite
> A wide nocturnal interior of an empty fine-dining wood-fire restaurant dining room: a single long set oak table with sober chairs, dark concrete and timber walls, deep shadows pooling in the corners, before service. The whole scene sits in cold graphite half-light; a single distant low lamp or candle casts one small amber pinpoint of warmth far down the table as the only warm accent. 16:9 panoramic framing, calm symmetry broken gently, generous negative space, soft directional light from one side, fine film grain. Ultra high detail, 8K, professional interior architecture photography.

---

# 3. DEMO VITTA — clínica integrada
Marca fictícia (saúde, multi-especialidades, Indaiatuba). Salvar em `/public/demos/vitta/`.
Atmosfera serena e clínica em meia-luz; retratos coerentes (mesmo ensaio).

### 3.1 · `recepcao.avif` · **4:5** (`--ar 4:5`) — hero
> The reception and waiting area of a calm, modern Brazilian integrated medical clinic at early morning: a low reception counter of poured concrete and pale wood, empty soft armchairs arranged with breathing space, one discreet potted plant, a corridor receding into shadow. Architectural-magazine restraint, no people or at most a single distant figure in half-light. Vertical 4:5 portrait framing, subject anchored slightly off-center with abundant ivory negative space above, soft side window light grazing the concrete; a single tiny warm amber glow from a recessed lamp deep in the corridor as the only warm note. Ultra high detail, 8K, professional architectural interior photography.

### 3.2 · `dra-helena.avif` · **3:4** (`--ar 3:4`) — Dra. Helena Prado, clínica geral
> A dignified studio portrait of a mature Brazilian woman physician, a general-practice doctor in her fifties, calm and trustworthy presence, wearing a plain understated white medical coat over a neutral top. Serene attentive expression, not a forced smile; gaze toward the camera or slightly off-axis. Skin rendered in soft half-light, fine pores and texture, dessaturated tones. Vertical 3:4 portrait crop, head and shoulders, single soft key light from the side carving gentle shadows, deep graphite background falling into shadow, a faint amber rim on one shoulder as the only warm accent. Ultra high detail, 8K, professional editorial portrait photography.
> _Negativo extra: no toothy smile, no stethoscope-around-neck cliche._

### 3.3 · `dr-caio.avif` · **3:4** (`--ar 3:4`) — Dr. Caio Monteiro, cardiologia
> A composed studio portrait of an adult Brazilian male cardiologist, late thirties to forties, firm yet welcoming presence, wearing a sober plain medical coat over a dark neutral shirt. Focused, gentle expression, no corporate posing; three-quarter angle, gaze slightly off-camera. Skin in soft half-light with fine natural texture, dessaturated cold tones, matching the same photographic session as the other clinical portraits. Vertical 3:4 portrait crop, head and shoulders, single soft directional key light from the opposite side to vary the series, deep graphite background dissolving into shadow, one faint amber catchlight reflected on the iris as the sole warm accent. Ultra high detail, 8K, professional editorial portrait photography.

### 3.4 · `dra-julia.avif` · **3:4** (`--ar 3:4`) — Dra. Julia Tavares, dermatologia
> A poised studio portrait of a young-adult Brazilian woman dermatologist, around thirty, attentive caring presence, wearing a discreet plain white medical coat over a soft neutral top. Serene professional expression, no forced smile; calm direct gaze with hair in a relaxed natural style. Clear healthy skin rendered in soft half-light with fine realistic texture, dessaturated cold tones, same photographic series as the other clinical portraits. Vertical 3:4 portrait crop, head and shoulders, single soft key light grazing from the side, deep graphite background fading into shadow, a single faint amber highlight on a strand of hair as the only warm note. Ultra high detail, 8K, professional editorial portrait photography.
> _Negativo extra: no beauty-ad glossy retouch._

### 3.5 · `corredor.avif` · **16:10** (`--ar 16:10`) — corredor da clínica
> The interior corridor of a calm Brazilian medical clinic seen in one-point perspective: a clean hallway receding to a vanishing point, evenly spaced consulting-room doors, pale concrete-and-plaster walls, a continuous seamless floor, soft daylight falling from a skylight or far window. Completely empty, silent, a sense of order and quiet. Horizontal 16:10 framing, strong central depth perspective, low-to-medium exposure, gentle graded shadows in the corners, a single small amber glow from one doorway light deep down the corridor as the only warm accent. Ultra high detail, 8K, professional architectural interior photography.

### 3.6 · `fachada.avif` · **16:10** (`--ar 16:10`) — fachada de manhã
> The street-facing exterior facade of a small contemporary neighborhood medical clinic in a Brazilian town at early morning: sober modern architecture in pale exposed concrete and glass, a discreet recessed entrance, slender sidewalk trees casting soft long shadows across the wall (an avenue lined with acacia-like trees). Quiet, no pedestrians or one distant blurred passer-by. Horizontal 16:10 framing, three-quarter angle on the building, soft low-angle morning side light, dessaturated cold graphite tones, subtle corner vignette, a single small amber glow from an interior lobby light behind the glass as the only warm accent. Ultra high detail, 8K, professional architectural exterior photography.
> _Negativo extra: no shop signage, no street signs, no license plates, no saturated blue sky._

---

# 4. DEMO FORO — advocacia
Marca fictícia (escritório jurídico, Campinas). Salvar em `/public/demos/foro/`.
Arquivo, papel, sigilo, erudição. Materiais nobres em meia-luz.

### 4.1 · `arquivo.avif` · **3:4** (`--ar 3:4`) — detalhe do arquivo
> Extreme close-up detail of a Brazilian law-firm archive: the worn spines and edges of stacked legal case folders and bound court records on a tall shelf, one bundle tied with a thin cotton ribbon, paper and aged card catching a single soft grazing light from the left. Vertical 3:4 portrait framing, the stack rising through the frame with deep shadow falling into the lower right, vast quiet negative space of graphite gloom around the lit edge. One faint amber glint on a single folder edge, nothing more. Macro depth of field, near silence. Ultra high detail, 8K, professional photography.
> _Negativo extra: no readable labels on the folders._

### 4.2 · `biblioteca.avif` · **4:5** (`--ar 4:5`) — a biblioteca do escritório
> A quiet law-firm library at dusk: a tall floor-to-ceiling shelf densely packed with sober leather-and-cloth legal volumes, their uniform spines fading into graphite shadow, a single empty reading armchair of dark brushed wood and muted fabric in the foreground. Soft directional light rakes across the shelves from a lateral window just out of frame, gentle long shadows, controlled penumbra in the corners. Vertical 4:5 framing, generous negative space of dim air above the chair, one faint amber pool of lamplight glowing on a single shelf in the far depth. Dessaturated, contemplative, scholarly. Ultra high detail, 8K, professional photography.
> _Negativo extra: no readable book titles, no rainbow book spines._

### 4.3 · `artigo-contrato.avif` · **4:3** (`--ar 4:3`) — publicação: contrato e previsibilidade
> Still life of a slim brushed-metal fountain pen resting diagonally across the final printed pages of a service contract, the blank signature and initial lines visible as faint empty rules on cream paper, soft directional light skimming from the upper left to reveal paper grain. Horizontal 4:3 framing, dark graphite tabletop and quiet negative space surrounding the documents, a single tiny amber reflection on the polished pen nib. Shallow depth of field, calm and deliberate. Ultra high detail, 8K, professional photography.
> _Negativo extra: no legible words on the contract, no visible signature._

### 4.4 · `artigo-familia.avif` · **4:3** (`--ar 4:3`) — publicação: guarda compartilhada
> Quiet still life of an open paper desk calendar or planner lying on a sober dark table, several grid cells faintly marked with light pencil ticks and a thin graphite line linking two days, suggesting an alternating schedule, no readable numbers. Soft diagonal light grazes the paper from the left, gentle shadow of the page curl, generous negative space of graphite gloom around it. Horizontal 4:3 framing, discreet and restrained, a single barely-there amber warmth in the far corner. Shallow focus, contemplative. Ultra high detail, 8K, professional photography.
> _Negativo extra: no readable numbers, no children, no sentimental cliche, no toys._

### 4.5 · `artigo-lgpd.avif` · **4:3** (`--ar 4:3`) — publicação: proteção de dados
> Still life of a brushed-steel filing drawer slightly ajar, neat rows of paper folder tabs receding into shadow, a small heavy metal lock resting on the front edge, soft directional light from the right catching the cold metal sheen and the paper edges. Horizontal 4:3 framing, dark graphite surroundings and quiet negative space, a single tiny amber glint on the lock's metal. Shallow depth of field, sober and secure mood, no digital iconography. Ultra high detail, 8K, professional photography.
> _Negativo extra: no computer/phone screens, no padlock-shield icon, no binary code._

### 4.6 · `sala-reuniao.avif` · **16:10** (`--ar 16:10`) — a sala de reunião
> An empty law-firm meeting room: a long sober dark-wood conference table with minimal aligned chairs, beside a tall window admitting soft diffuse lateral daylight that fades into graphite shadow across the far end of the room. Wide horizontal 16:10 framing, the table receding into deep quiet negative space, controlled penumbra in the corners, the architecture clean and restrained like an architecture-magazine night shoot. A single faint amber reflection glows on the table surface near the window. Dessaturated, serene, expectant stillness, no people. Ultra high detail, 8K, professional photography.

---

# 5. DEMO PRUMO — reforma e serviços
Marca fictícia (manutenção/reforma residencial, região de Campinas). Salvar em `/public/demos/prumo/`.
Trabalho honesto, método, materiais. O âmbar conversa com o laranja-brasa da marca.

### 5.1 · `hero-equipe.avif` · **16:5** (`--ar 16:5`) — faixa: a equipe em obra
> Ultra-wide panoramic editorial photograph of a small Brazilian home-renovation crew at work inside an unfinished apartment: two or three tradespeople in plain neutral work coveralls, seen mid-task among raw masonry walls, a low scaffold, stacked cement bags and tools. Honest working scene, not posed, faces partly in half-light. Wide horizontal cinematic framing with deep negative space on the sides, one diagonal shaft of soft window light raking across cold grey concrete, long gentle shadows. Single tiny amber glow from a distant work lamp as the only warm accent. Dust hanging softly in the light. Ultra high detail, 8K, professional photography.
> _Negativo extra: no smiling posed workers giving thumbs up._

### 5.2 · `servicos-ferramentas.avif` · **21:9** (`--ar 21:9`) — bancada de ferramentas
> Ultra-wide top-down still life of a tradesperson's tool bench laid out with obsessive order: brushed-metal wrenches, pliers, a multimeter, a cordless drill, spirit levels, measuring tapes and coiled cable arranged in neat parallel rows on a raw concrete or unfinished wood surface. Industrial, sober, monochromatic grey palette, soft directional light grazing the brushed-metal edges, long quiet shadows, deep negative space around the tools. One single small amber reflection on a metal edge as the only warm accent. Ultra high detail, 8K, professional product photography.

### 5.3 · `cozinha-depois.avif` · **16:9** (`--ar 16:9`) — antes/depois: DEPOIS
**Importante:** mesma cozinha e mesmo ângulo/lente da 5.4.
> A small, fully renovated Brazilian apartment kitchen, 70 square meters flat, photographed in a 16:9 frame with an architectural eye-level lens, head-on composition. Newly finished: clean matte cabinetry with straight minimalist lines, a smooth stone countertop, freshly painted cold-grey walls, planned recessed lighting, spotless floor, everything in serene order. Calm, half-lit nocturnal architecture-magazine mood, soft directional light from one side window, gentle long shadows, deep negative space. One single tiny amber glow from a warm under-cabinet light as the only warm accent. Ultra high detail, 8K, professional interior photography. IMPORTANT: this is the 'after' that must match the exact same camera angle, lens and vantage point as its 'before' counterpart.

### 5.4 · `cozinha-antes.avif` · **16:9** (`--ar 16:9`) — antes/depois: ANTES
**Importante:** mesma cozinha da 5.3. **Entregue colorida e em exposição normal** (o site escurece/dessatura automaticamente).
> The very same small Brazilian apartment kitchen BEFORE renovation, 70 square meters flat, photographed in a 16:9 frame with the identical architectural eye-level lens and head-on composition as its renovated twin. Tired, worn original state: faded old cabinet doors, chipped vintage wall tiles, paint peeling and damp stains on a cold grey wall, a scuffed worn countertop, exposed wiring, dim poor lighting. Honest, un-staged, melancholic but quiet; soft directional light from one side, long shadows, controlled penumbra, deep negative space. One single faint amber reflection as the only warm accent. Ultra high detail, 8K, professional interior photography. IMPORTANT: same camera angle, lens, and vantage point as the 'after' image; deliver in full color and normal exposure.
> _Negativo extra: do not pre-apply grayscale or darkening._

### 5.5 · `medicao-laser.avif` · **16:10** (`--ar 16:10`) — medição com nível a laser (fundo preto)
> Intimate close-up of a precise on-site measurement: a hand-held laser level projecting a single thin straight beam of light across a raw concrete wall in a dark unfinished room, a tradesperson's hands steadying the brushed-metal device or a tape measure, exact and technical gesture, skin in deep half-light. Very dark graphite environment, strong negative space, one diagonal sliver of soft light, fine dust in the air, controlled penumbra. The laser line is the brightest element, kept cold and thin; one single tiny amber accent on the device only. Ultra high detail, 8K, professional photography.
> _Negativo extra: keep the laser line cool, not red._

### 5.6 · `van-equipe.avif` · **16:10** (`--ar 16:10`) — a van da equipe
> A plain unbranded work service van parked on a quiet Brazilian suburban street at dusk, in front of a residential house facade and gate, in a calm Campinas-region neighbourhood. The van is sober matte grey, blank-sided, seen at a three-quarter angle with generous negative space around it; cold graphite tones, a single diagonal of soft fading daylight, long gentle shadows on the pavement, controlled vignette. One single tiny amber glow from a distant streetlamp or window as the only warm accent. Ultra high detail, 8K, professional photography.
> _Negativo extra: no license plate text, no van livery._

---

# 6. DEMO SOLAR — imobiliária boutique
Marca fictícia (imóveis de alto padrão, Campinas). Salvar em `/public/demos/solar/`.
Aqui o calor é a **luz dourada do fim de tarde** (sempre como luz, nunca cor saturada).

> _Ajuste do preâmbulo para esta seção:_ troque a frase do âmbar por "warmed only
> by the single rare amber accent of golden-hour sunlight" — o âmbar é o sol
> rasante do entardecer.

### 6.1 · `casa-patio-fachada.avif` · **4:5** (`--ar 4:5`) — hero: Casa do Pátio (fachada)
> The front facade of a contemporary single-storey high-end Brazilian house in a leafy upscale neighbourhood of Campinas, Sao Paulo, photographed straight-on at the very end of the day. Clean horizontal volumes, tall ceilings, large glass spans, exposed board-formed concrete and warm wood cladding, a low front garden of native tropical planting. Warm grazing amber light of late afternoon skims across the facade and throws long soft shadows; sky deep and cool above. Vertical portrait composition, the house grounded in the lower two thirds with quiet sky and negative space above, eye-level architectural framing, shallow controlled depth. Ultra high detail, 8K, professional architectural photography.
> _Negativo extra: no for-sale signs, no cars in foreground._

### 6.2 · `casa-patio-patio.avif` · **16:10** (`--ar 16:10`) — Casa do Pátio: pátio interno
> The internal open-air courtyard at the heart of a single-storey high-end Brazilian house, with a small garden, a low cast-concrete bench, and a double-height living room opening onto it through large floor-to-ceiling glass. Warm amber end-of-day light pours into the courtyard and grazes the floor; cool shadow in the surrounding volumes. Wide horizontal landscape composition, looking across the courtyard, architectural eye-level framing, calm symmetry softened, deep quiet negative space. Ultra high detail, 8K, professional architectural photography.

### 6.3 · `casa-patio-interior.avif` · **16:10** (`--ar 16:10`) — Casa do Pátio: sala/cozinha
> The double-height living room of a high-end Brazilian house, opening into a minimal kitchen that faces a garden through full-height glass. A few sober pieces of furniture, warm wood floor, board-formed concrete wall, stone counter. Cool interior shadow with a single warm amber shaft of end-of-day light entering from the garden side and falling across the floor. Wide horizontal landscape composition, interior architectural framing at eye level, deep negative space, serene emptiness. Ultra high detail, 8K, professional interior photography.

### 6.4 · `varanda.avif` · **16:10** (`--ar 16:10`) — varanda ao entardecer (serve a 2 imóveis)
> A covered veranda / terrace of a high-end house at the end of the day, with a wood-and-burnished-concrete floor, a single slim column, and an open view onto Brazilian native greenery and a quiet garden beyond. Warm amber grazing sunlight rakes across the deck from the side, long soft shadows, cool blue shade in the depth. Wide horizontal landscape composition, looking out from under the veranda toward the green view, eye-level framing, deep negative space and atmosphere. Ultra high detail, 8K, professional architectural photography.

### 6.5 · `apartamento-interior.avif` · **16:10 + 4:5** (gerar com folga p/ recortar nas duas)
**Mostra:** apto de andar alto com vista (também usado como "escritório da imobiliária ao entardecer").
> The serene interior of a high-floor apartment with an unobstructed city view and a glazed gourmet balcony, end of day, equally readable as a quiet editorial real-estate office at dusk. A low wooden table, one discreet armchair, full-height glazing framing a hazy Brazilian city skyline in warm amber light. Cool interior shade, a single warm shaft of sun across the floor. Balanced central composition with even breathing room top and bottom and on the sides so it crops well as both landscape and portrait, eye-level interior framing, deep negative space. Ultra high detail, 8K, professional interior photography.

### 6.6 · `vista-horizonte.avif` · **16:10** (`--ar 16:10`) — a vista (serve a 2 imóveis)
> A wide unobstructed view at the end of the day from a high vantage point, looking over the soft rolling green hills and tree canopy of the Campinas region of Sao Paulo under a calm dusk sky, with a discreet foreground edge of a glass balustrade or veranda parapet. Layered atmospheric haze receding into distance, a low band of warm amber light along the horizon, cool blue tones above. Wide horizontal landscape composition, horizon kept low for generous sky and air, deep negative space, quiet and expansive. Ultra high detail, 8K, professional landscape photography.

### 6.7 · `varanda-gourmet.avif` · **16:10** (`--ar 16:10`) — varanda gourmet envidraçada
> A glazed gourmet balcony of a high-end reformed apartment at the end of the day: a fully glassed-in terrace with a sober built-in stone counter and minimal built-in grill, slim brushed-metal window frames, the hazy view beyond the glass. Cool interior shade with a single warm amber shaft of evening light grazing the counter. Wide horizontal landscape composition, interior architectural framing at eye level, deep negative space, serene and uncluttered. Ultra high detail, 8K, professional interior photography.

### 6.8 · `refugio-serra.avif` · **16:10** (`--ar 16:10`) — casa de campo + piscina natural
> A low countryside house of stone and wood nestled in an orchard and preserved native woodland in the hills near Campinas, Sao Paulo, at the end of the day, with a natural-edge swimming pool in the foreground, an organic biopool with no tiles, blending into the planting, its still surface mirroring the warm amber dusk sky. Quiet retreat atmosphere, layered greenery, grazing low sunlight, cool shade in the trees. Wide horizontal landscape composition, the pool reflection anchoring the lower third, the house and woodland behind, deep negative space and air. Ultra high detail, 8K, professional architectural and landscape photography.
> _Negativo extra: no oversaturated turquoise water, no pool toys, no resort cheerfulness._

---

## Resumo de contagem

| Área | Imagens |
|---|---|
| Home (estúdio) | 7 (+ OG/favicon opcionais) |
| Demo Brasa | 11 |
| Demo Vitta | 6 |
| Demo Foro | 6 |
| Demo Prumo | 6 |
| Demo Solar | 8 |
| **Total** | **44** |

**Não gerar (arte autoral já correta):** `public/modelos/{brasa,vitta,foro,prumo,solar}.svg`,
`AssinaturaAndrade`, `selftest-terminal.svg`, `app/icon.svg`, e toda a arte do
case **NeuroCode** (rede neural em SVG).
