
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function clamp(num, min, max) {
        return num < min ? min : num > max ? max : num;
    }

    /* src/DoubleRangeSlider.svelte generated by Svelte v3.22.2 */
    const file = "src/DoubleRangeSlider.svelte";

    function create_fragment(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let draggable_action;
    	let t0;
    	let div1;
    	let draggable_action_1;
    	let t1;
    	let div2;
    	let draggable_action_2;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "body svelte-1507pyp");
    			set_style(div0, "left", 100 * /*start*/ ctx[0] + "%");
    			set_style(div0, "right", 100 * (1 - /*end*/ ctx[1]) + "%");
    			add_location(div0, file, 113, 2, 2630);
    			attr_dev(div1, "class", "handle svelte-1507pyp");
    			attr_dev(div1, "data-which", "start");
    			set_style(div1, "left", 100 * /*start*/ ctx[0] + "%\n\t\t\t");
    			add_location(div1, file, 123, 2, 2843);
    			attr_dev(div2, "class", "handle svelte-1507pyp");
    			attr_dev(div2, "data-which", "end");
    			set_style(div2, "left", 100 * /*end*/ ctx[1] + "%\n\t\t\t");
    			add_location(div2, file, 133, 2, 3061);
    			attr_dev(div3, "class", "slider svelte-1507pyp");
    			add_location(div3, file, 112, 1, 2588);
    			attr_dev(div4, "class", "double-range-container svelte-1507pyp");
    			add_location(div4, file, 111, 0, 2550);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			/*div0_binding*/ ctx[7](div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			/*div1_binding*/ ctx[8](div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			/*div3_binding*/ ctx[9](div3);
    			if (remount) run_all(dispose);

    			dispose = [
    				action_destroyer(draggable_action = draggable.call(null, div0)),
    				listen_dev(div0, "dragmove", stop_propagation(prevent_default(/*setHandlesFromBody*/ ctx[6])), false, true, true),
    				action_destroyer(draggable_action_1 = draggable.call(null, div1)),
    				listen_dev(div1, "dragmove", stop_propagation(prevent_default(/*setHandlePosition*/ ctx[5]("start"))), false, true, true),
    				action_destroyer(draggable_action_2 = draggable.call(null, div2)),
    				listen_dev(div2, "dragmove", stop_propagation(prevent_default(/*setHandlePosition*/ ctx[5]("end"))), false, true, true)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*start*/ 1) {
    				set_style(div0, "left", 100 * /*start*/ ctx[0] + "%");
    			}

    			if (dirty & /*end*/ 2) {
    				set_style(div0, "right", 100 * (1 - /*end*/ ctx[1]) + "%");
    			}

    			if (dirty & /*start*/ 1) {
    				set_style(div1, "left", 100 * /*start*/ ctx[0] + "%\n\t\t\t");
    			}

    			if (dirty & /*end*/ 2) {
    				set_style(div2, "left", 100 * /*end*/ ctx[1] + "%\n\t\t\t");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			/*div0_binding*/ ctx[7](null);
    			/*div1_binding*/ ctx[8](null);
    			/*div3_binding*/ ctx[9](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function draggable(node) {
    	let x;
    	let y;

    	function handleMousedown(event) {
    		if (event.type === "touchstart") {
    			event = event.touches[0];
    		}

    		x = event.clientX;
    		y = event.clientY;
    		node.dispatchEvent(new CustomEvent("dragstart", { detail: { x, y } }));
    		window.addEventListener("mousemove", handleMousemove);
    		window.addEventListener("mouseup", handleMouseup);
    		window.addEventListener("touchmove", handleMousemove);
    		window.addEventListener("touchend", handleMouseup);
    	}

    	function handleMousemove(event) {
    		if (event.type === "touchmove") {
    			event = event.changedTouches[0];
    		}

    		const dx = event.clientX - x;
    		const dy = event.clientY - y;
    		x = event.clientX;
    		y = event.clientY;
    		node.dispatchEvent(new CustomEvent("dragmove", { detail: { x, y, dx, dy } }));
    	}

    	function handleMouseup(event) {
    		x = event.clientX;
    		y = event.clientY;
    		node.dispatchEvent(new CustomEvent("dragend", { detail: { x, y } }));
    		window.removeEventListener("mousemove", handleMousemove);
    		window.removeEventListener("mouseup", handleMouseup);
    		window.removeEventListener("touchmove", handleMousemove);
    		window.removeEventListener("touchend", handleMouseup);
    	}

    	node.addEventListener("mousedown", handleMousedown);
    	node.addEventListener("touchstart", handleMousedown);

    	return {
    		destroy() {
    			node.removeEventListener("mousedown", handleMousedown);
    			node.removeEventListener("touchstart", handleMousedown);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { start = 0 } = $$props;
    	let { end = 1 } = $$props;
    	let leftHandle;
    	let body;
    	let slider;

    	function setHandlePosition(which) {
    		return function (evt) {
    			const { left, right } = slider.getBoundingClientRect();
    			const parentWidth = right - left;
    			const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);

    			if (which === "start") {
    				$$invalidate(0, start = p);
    				$$invalidate(1, end = Math.max(end, p));
    			} else {
    				$$invalidate(0, start = Math.min(p, start));
    				$$invalidate(1, end = p);
    			}
    		};
    	}

    	function setHandlesFromBody(evt) {
    		const { width } = body.getBoundingClientRect();
    		const { left, right } = slider.getBoundingClientRect();
    		const parentWidth = right - left;
    		const leftHandleLeft = leftHandle.getBoundingClientRect().left;
    		const pxStart = clamp(leftHandleLeft + event.detail.dx - left, 0, parentWidth - width);
    		const pxEnd = clamp(pxStart + width, width, parentWidth);
    		const pStart = pxStart / parentWidth;
    		const pEnd = pxEnd / parentWidth;
    		$$invalidate(0, start = pStart);
    		$$invalidate(1, end = pEnd);
    	}

    	const writable_props = ["start", "end"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DoubleRangeSlider> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DoubleRangeSlider", $$slots, []);

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(3, body = $$value);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, leftHandle = $$value);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(4, slider = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("start" in $$props) $$invalidate(0, start = $$props.start);
    		if ("end" in $$props) $$invalidate(1, end = $$props.end);
    	};

    	$$self.$capture_state = () => ({
    		clamp,
    		start,
    		end,
    		leftHandle,
    		body,
    		slider,
    		draggable,
    		setHandlePosition,
    		setHandlesFromBody
    	});

    	$$self.$inject_state = $$props => {
    		if ("start" in $$props) $$invalidate(0, start = $$props.start);
    		if ("end" in $$props) $$invalidate(1, end = $$props.end);
    		if ("leftHandle" in $$props) $$invalidate(2, leftHandle = $$props.leftHandle);
    		if ("body" in $$props) $$invalidate(3, body = $$props.body);
    		if ("slider" in $$props) $$invalidate(4, slider = $$props.slider);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		start,
    		end,
    		leftHandle,
    		body,
    		slider,
    		setHandlePosition,
    		setHandlesFromBody,
    		div0_binding,
    		div1_binding,
    		div3_binding
    	];
    }

    class DoubleRangeSlider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { start: 0, end: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DoubleRangeSlider",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get start() {
    		throw new Error("<DoubleRangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<DoubleRangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<DoubleRangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<DoubleRangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.22.2 */
    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let updating_start;
    	let updating_end;
    	let t2;
    	let div2;
    	let div0;
    	let t3_value = /*nice*/ ctx[2](/*start*/ ctx[0]) + "";
    	let t3;
    	let t4;
    	let div1;
    	let t5_value = /*nice*/ ctx[2](/*end*/ ctx[1]) + "";
    	let t5;
    	let current;

    	function doublerangeslider_start_binding(value) {
    		/*doublerangeslider_start_binding*/ ctx[3].call(null, value);
    	}

    	function doublerangeslider_end_binding(value) {
    		/*doublerangeslider_end_binding*/ ctx[4].call(null, value);
    	}

    	let doublerangeslider_props = {};

    	if (/*start*/ ctx[0] !== void 0) {
    		doublerangeslider_props.start = /*start*/ ctx[0];
    	}

    	if (/*end*/ ctx[1] !== void 0) {
    		doublerangeslider_props.end = /*end*/ ctx[1];
    	}

    	const doublerangeslider = new DoubleRangeSlider({
    			props: doublerangeslider_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(doublerangeslider, "start", doublerangeslider_start_binding));
    	binding_callbacks.push(() => bind(doublerangeslider, "end", doublerangeslider_end_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Hello World!";
    			t1 = space();
    			create_component(doublerangeslider.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			t5 = text(t5_value);
    			attr_dev(h1, "class", "svelte-1hk1k56");
    			add_location(h1, file$1, 12, 1, 191);
    			attr_dev(div0, "class", "label svelte-1hk1k56");
    			add_location(div0, file$1, 15, 2, 279);
    			attr_dev(div1, "class", "label svelte-1hk1k56");
    			add_location(div1, file$1, 16, 2, 320);
    			attr_dev(div2, "class", "labels");
    			add_location(div2, file$1, 14, 1, 256);
    			attr_dev(main, "class", "svelte-1hk1k56");
    			add_location(main, file$1, 11, 0, 183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(doublerangeslider, main, null);
    			append_dev(main, t2);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t3);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, t5);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const doublerangeslider_changes = {};

    			if (!updating_start && dirty & /*start*/ 1) {
    				updating_start = true;
    				doublerangeslider_changes.start = /*start*/ ctx[0];
    				add_flush_callback(() => updating_start = false);
    			}

    			if (!updating_end && dirty & /*end*/ 2) {
    				updating_end = true;
    				doublerangeslider_changes.end = /*end*/ ctx[1];
    				add_flush_callback(() => updating_end = false);
    			}

    			doublerangeslider.$set(doublerangeslider_changes);
    			if ((!current || dirty & /*start*/ 1) && t3_value !== (t3_value = /*nice*/ ctx[2](/*start*/ ctx[0]) + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*end*/ 2) && t5_value !== (t5_value = /*nice*/ ctx[2](/*end*/ ctx[1]) + "")) set_data_dev(t5, t5_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(doublerangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(doublerangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(doublerangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let start;
    	let end;

    	const nice = d => {
    		if (!d && d !== 0) return "";
    		return d.toFixed(2);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function doublerangeslider_start_binding(value) {
    		start = value;
    		$$invalidate(0, start);
    	}

    	function doublerangeslider_end_binding(value) {
    		end = value;
    		$$invalidate(1, end);
    	}

    	$$self.$capture_state = () => ({ DoubleRangeSlider, start, end, nice });

    	$$self.$inject_state = $$props => {
    		if ("start" in $$props) $$invalidate(0, start = $$props.start);
    		if ("end" in $$props) $$invalidate(1, end = $$props.end);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		start,
    		end,
    		nice,
    		doublerangeslider_start_binding,
    		doublerangeslider_end_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
