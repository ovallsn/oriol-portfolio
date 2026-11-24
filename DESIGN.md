# Design system — Oriol Valls portfolio

## Intent

An editorial, warm technical portfolio for a job candidate. It should feel credible to hiring teams, make support work concrete, and leave the CV and contact actions easy to find.

## Visual tokens

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| Canvas | `#F4F1E9` | `#101A16` | Main page background |
| Surface | `#FFFEFA` | `#1A2821` | Distinct content surface |
| Ink | `#16362E` | `#F2F1E9` | Main text and strong controls |
| Muted ink | `#53645D` | `#B8C7BE` | Supporting text |
| Accent | `#C85F48` | `#F08B71` | Small emphasis and active states |
| Hairline | `#D7D8CC` | `#34443A` | Dividers and borders |
| Forest panel | `#173B32` | `#223E34` | Business evidence and contact close |
| On forest | `#F6F3EA` | `#F6F3EA` | Text inside forest surfaces |

## Typography

- Self-host DM Sans under its SIL Open Font License 1.1 in weights 400–800. Use the same family for headings, prose and controls.
- Use a plain text signature in system monospace in the header. Use the simplified trefoil in the browser tab and on the reverse of the portrait card.
- Keep body copy around 65–75 characters per line on wide screens and display type below 6rem.

## Composition

- Constrain the main content to roughly 1160px with generous side gutters.
- Lead with Oriol’s name and role, a CV selector and an original animated trefoil mesh. Draw the mesh in Canvas with no external runtime. Use a still frame without JavaScript and start with motion paused when the visitor prefers reduced motion.
- Let the centered navigation float over the opening scene. Move its selection indicator as the visible section changes and collapse it behind a native disclosure control on narrow screens.
- Place the brief biography and Oriol’s portrait directly below the introduction. The portrait turns from back to front on entry and returns to its back as it leaves the viewport. The front is the static default for reduced motion and without JavaScript.
- Show the live Valls Solutions homepage in a browser frame and use real LetsStudy screens in the Android preview, including interview preparation. Make each preview a link to the corresponding public project.
- Present professional experience as two timelines, one for support and development and one for operations and business. Keep dates, employers and roles visible.
- Use a fine drafting grid in the opening and skills sections. Use curved lines and a single animated trace on entry behind the two-column contact panel. Keep the contact form and its labels above this background.

## Interaction and accessibility

- English is the default at `/`. Show English first in the EN/ES control and mark the current language. Spanish remains available at `/es/`, and the header signature returns to the English home.
- Keep the trefoil rotation in its broad plane with restrained pointer tilt, so its silhouette stays balanced alongside the introduction. Use the same initial pose for its static fallback.
- Skill filters are native buttons, expose the active state, and update a concise usage example.
- Use short CSS transitions, visible focus rings, WCAG AA text contrast, and a reduced-motion fallback.
- Use one entrance for the opening copy and brief, one-time reveals for project previews, experience entries and the contact panel. They remain visible with JavaScript unavailable or reduced motion enabled.
- Use the interactive mesh as the hero visual instead of a video. Provide a pause control and suspend drawing while the scene is offscreen.

## Reference adaptation

- Reviewed the supplied portfolio reference plus Brittany Chiang and Lee Robinson for personal introductions, restrained navigation, and evidence-led content hierarchy.
- Adapted the reference’s split introduction, diagonal background and floating navigation to Oriol’s warm canvas, forest palette, original copy, CV links and business evidence. The animated mesh uses a trefoil form and an independently authored renderer.
- No source code, branding, copy, artwork, or assets were reused from those sites; a license covering them was not established.
- The Valls Solutions images are captures of its English and Spanish homepages. They include a still from Vlada Karpovich’s [Pexels video 7552423](https://www.pexels.com/video/businesspeople-doing-paperwork-7552423/), reused under the [Pexels license](https://www.pexels.com/license/).
- The LetsStudy images come from its [published screenshots](https://github.com/ovallsn/letsstudy/tree/main/docs/screenshots). Oriol provided the original portrait. The portfolio displays a background-edited version of that photo.
- The Android clock card uses screenshots from Oriol’s TimeValls project. The Shopify and VallsTV panels use original CSS illustrations.
