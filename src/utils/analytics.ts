import ReactGA from 'react-ga4';

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track events
export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

// Track user interactions
export const trackUserInteraction = (action: string, label?: string) => {
  trackEvent('User Interaction', action, label);
};

// Track map interactions
export const trackMapInteraction = (action: string, label?: string) => {
  trackEvent('Map Interaction', action, label);
};

// Track navigation events
export const trackNavigation = (action: string, label?: string) => {
  trackEvent('Navigation', action, label);
};

// Track weather interactions
export const trackWeatherInteraction = (action: string, label?: string) => {
  trackEvent('Weather', action, label);
};

// Track traffic interactions
export const trackTrafficInteraction = (action: string, label?: string) => {
  trackEvent('Traffic', action, label);
}; 