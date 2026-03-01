/**
 * Module Federation requires a dynamic import bootstrap pattern
 * so shared modules (like Vue) are properly resolved before app init.
 */
import('./bootstrap')
