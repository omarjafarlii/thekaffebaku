export const INTRO_KEY = "tk-intro-seen";

/**
 * Runs before first paint: shows the intro only on the very first visit
 * (localStorage). Returning visitors go straight to the site.
 */
const code = `(function(){try{var d=document.documentElement;d.dataset.intro=localStorage.getItem('${INTRO_KEY}')?'none':'show';}catch(e){document.documentElement.dataset.intro='none';}})();`;

export function IntroScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
