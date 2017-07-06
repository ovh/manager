import bowser from "bowser";
import browsers from "./supported_browsers.json";

export default class {
    isSupported () {
        return bowser.check(browsers.unsupported);
    }

    isDeprecated () {
        return !bowser.check(browsers.deprecated);
    }
}
