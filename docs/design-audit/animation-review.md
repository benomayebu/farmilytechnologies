# Animation review (item 3.4)

Lens: animation performance (transform and opacity only, no endless
loops behind text). Verified from code and in desktop Chrome; nothing
here was recorded on a real phone.

## Removed or changed (in rule, committed)

| Element | Before | Cause | After |
|---|---|---|---|
| Hero background route line, `ColdChainIllustration.tsx` | `stroke-dashoffset` loop, 14s, forever | Paint tier: repainted an 80%-wide SVG every frame for the whole visit, behind text at 32% opacity where it added nothing | Static dashed line |
| Hero background fade, `globals.css` | 1000ms | Kept moving after the 690ms hero settle | 600ms |
| Hero pointer parallax | `pointermove` + transform for the whole visit | Removed in 3.2 | Gone |
| Buttons, header CTA, submit | `transition-all` | Animated outline-color and anything else that changed | Named properties (3.3) |
| `.animate-hero-in` | Unused keyframes and class | Dead code | Deleted |

## Left as is

| Element | Animates | Tier | Note |
|---|---|---|---|
| Mobile menu, FAQ, demo tip and tamper panels | `grid-template-rows` | Layout | The standard way to animate to auto height. Short (300ms) and user-triggered. Swapping to transform means a different reveal design. |
| Solution pillar cards hover | `box-shadow` + lift | Paint | Hover only, three small cards. Could use `filter: drop-shadow`. |
| Timeline scrubber marker | SVG `x1/x2`, `cx/cy` | Paint | Tiny SVG, follows the drag. Fine. |
| Header on scroll | `box-shadow`, `background-color` | Paint | Fires once when you pass 4px. Fine. |
| Links | `transition-colors` | Paint | Also fades outline-color, so link focus rings fade in over 150ms. Fixing needs a Tailwind override; a one-line `@utility` attempt did not take effect. |

Everything that moves still uses transform and opacity with `--ease-out`,
and every keyframe animation is switched off under reduced motion.
