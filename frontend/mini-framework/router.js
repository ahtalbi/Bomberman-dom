export class Router {
    #Routes = Object.create(null);
    #FirstResolve = false;

    on(path, handler) {
        this.#Routes[path] = handler;
        return this;
    }
    
    navigate(path, { history = "push" } = {}) {
        path = path.startsWith("/") ? path : "/" + path;
        return navigation.navigate(path, { history });
    }
    
    resolve(path = location.pathname) {
        const fn = this.#Routes[path];

        if (!fn) {
            return false;
        }

        fn({ url: new URL(location.href) });
        return true;
    }

    listen(onError404) {
        navigation.addEventListener("navigate", (event) => {
            const url = new URL(event.destination.url);
            
            event.intercept({
                handler: () => {
                    console.log(url.pathname, this.#Routes);

                    const fn = this.#Routes[url.pathname];
                    if (!fn) {
                        onError404();
                        return;
                    }
                    fn({ url });
                }
            });
        });

        if (!this.#FirstResolve) {
            this.resolve();
            this.#FirstResolve = true;
        }
        return this;
    }
}