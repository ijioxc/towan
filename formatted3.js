import { m as Mn, $ as Pr, a as Rn } from "./app.EepeurVf.js";
import { $ as Xt, a as Oi } from "./hoisted.Cll8eMbw.js";
import { g as $e, C as jr } from "./CustomEase.D9G9csrQ.js";
function Ln(s, e) {
  for (var r = 0; r < e.length; r++) {
    var t = e[r];
    ((t.enumerable = t.enumerable || !1),
      (t.configurable = !0),
      "value" in t && (t.writable = !0),
      Object.defineProperty(s, t.key, t));
  }
}
function Dn(s, e, r) {
  return (e && Ln(s.prototype, e), s);
}
/*!
 * Observer 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var be,
  Gi,
  Ge,
  Dt,
  At,
  si,
  en,
  Ht,
  Si,
  tn,
  yt,
  lt,
  rn,
  nn = function () {
    return (
      be ||
      (typeof window < "u" && (be = window.gsap) && be.registerPlugin && be)
    );
  },
  sn = 1,
  ni = [],
  D = [],
  pt = [],
  bi = Date.now,
  pr = function (e, r) {
    return r;
  },
  An = function () {
    var e = Si.core,
      r = e.bridge || {},
      t = e._scrollers,
      i = e._proxies;
    (t.push.apply(t, D),
      i.push.apply(i, pt),
      (D = t),
      (pt = i),
      (pr = function (a, o) {
        return r[a](o);
      }));
  },
  Pt = function (e, r) {
    return ~pt.indexOf(e) && pt[pt.indexOf(e) + 1][r];
  },
  xi = function (e) {
    return !!~tn.indexOf(e);
  },
  Pe = function (e, r, t, i, n) {
    return e.addEventListener(r, t, { passive: i !== !1, capture: !!n });
  },
  Ae = function (e, r, t, i) {
    return e.removeEventListener(r, t, !!i);
  },
  Ni = "scrollLeft",
  Bi = "scrollTop",
  gr = function () {
    return (yt && yt.isPressed) || D.cache++;
  },
  er = function (e, r) {
    var t = function i(n) {
      if (n || n === 0) {
        sn && (Ge.history.scrollRestoration = "manual");
        var a = yt && yt.isPressed;
        ((n = i.v = Math.round(n) || (yt && yt.iOS ? 1 : 0)),
          e(n),
          (i.cacheID = D.cache),
          a && pr("ss", n));
      } else
        (r || D.cache !== i.cacheID || pr("ref")) &&
          ((i.cacheID = D.cache), (i.v = e()));
      return i.v + i.offset;
    };
    return ((t.offset = 0), e && t);
  },
  Be = {
    s: Ni,
    p: "left",
    p2: "Left",
    os: "right",
    os2: "Right",
    d: "width",
    d2: "Width",
    a: "x",
    sc: er(function (s) {
      return arguments.length
        ? Ge.scrollTo(s, fe.sc())
        : Ge.pageXOffset || Dt[Ni] || At[Ni] || si[Ni] || 0;
    }),
  },
  fe = {
    s: Bi,
    p: "top",
    p2: "Top",
    os: "bottom",
    os2: "Bottom",
    d: "height",
    d2: "Height",
    a: "y",
    op: Be,
    sc: er(function (s) {
      return arguments.length
        ? Ge.scrollTo(Be.sc(), s)
        : Ge.pageYOffset || Dt[Bi] || At[Bi] || si[Bi] || 0;
    }),
  },
  He = function (e, r) {
    return (
      ((r && r._ctx && r._ctx.selector) || be.utils.toArray)(e)[0] ||
      (typeof e == "string" && be.config().nullTargetWarn !== !1
        ? console.warn("Element not found:", e)
        : null)
    );
  },
  zt = function (e, r) {
    var t = r.s,
      i = r.sc;
    xi(e) && (e = Dt.scrollingElement || At);
    var n = D.indexOf(e),
      a = i === fe.sc ? 1 : 2;
    (!~n && (n = D.push(e) - 1), D[n + a] || Pe(e, "scroll", gr));
    var o = D[n + a],
      h =
        o ||
        (D[n + a] =
          er(Pt(e, t), !0) ||
          (xi(e)
            ? i
            : er(function (m) {
                return arguments.length ? (e[t] = m) : e[t];
              })));
    return (
      (h.target = e),
      o || (h.smooth = be.getProperty(e, "scrollBehavior") === "smooth"),
      h
    );
  },
  mr = function (e, r, t) {
    var i = e,
      n = e,
      a = bi(),
      o = a,
      h = r || 50,
      m = Math.max(500, h * 3),
      R = function (g, I) {
        var Y = bi();
        I || Y - a > h
          ? ((n = i), (i = g), (o = a), (a = Y))
          : t
            ? (i += g)
            : (i = n + ((g - n) / (Y - o)) * (a - o));
      },
      k = function () {
        ((n = i = t ? 0 : i), (o = a = 0));
      },
      p = function (g) {
        var I = o,
          Y = n,
          J = bi();
        return (
          (g || g === 0) && g !== i && R(g),
          a === o || J - o > m
            ? 0
            : ((i + (t ? Y : -Y)) / ((t ? J : a) - I)) * 1e3
        );
      };
    return { update: R, reset: k, getVelocity: p };
  },
  pi = function (e, r) {
    return (
      r && !e._gsapAllow && e.preventDefault(),
      e.changedTouches ? e.changedTouches[0] : e
    );
  },
  zr = function (e) {
    var r = Math.max.apply(Math, e),
      t = Math.min.apply(Math, e);
    return Math.abs(r) >= Math.abs(t) ? r : t;
  },
  on = function () {
    ((Si = be.core.globals().ScrollTrigger), Si && Si.core && An());
  },
  ln = function (e) {
    return (
      (be = e || nn()),
      !Gi &&
        be &&
        typeof document < "u" &&
        document.body &&
        ((Ge = window),
        (Dt = document),
        (At = Dt.documentElement),
        (si = Dt.body),
        (tn = [Ge, Dt, At, si]),
        be.utils.clamp,
        (rn = be.core.context || function () {}),
        (Ht = "onpointerenter" in si ? "pointer" : "mouse"),
        (en = ie.isTouch =
          Ge.matchMedia &&
          Ge.matchMedia("(hover: none), (pointer: coarse)").matches
            ? 1
            : "ontouchstart" in Ge ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
              ? 2
              : 0),
        (lt = ie.eventTypes =
          (
            "ontouchstart" in At
              ? "touchstart,touchmove,touchcancel,touchend"
              : "onpointerdown" in At
                ? "pointerdown,pointermove,pointercancel,pointerup"
                : "mousedown,mousemove,mouseup,mouseup"
          ).split(",")),
        setTimeout(function () {
          return (sn = 0);
        }, 500),
        on(),
        (Gi = 1)),
      Gi
    );
  };
Be.op = fe;
D.cache = 0;
var ie = (function () {
  function s(r) {
    this.init(r);
  }
  var e = s.prototype;
  return (
    (e.init = function (t) {
      (Gi || ln(be) || console.warn("Please gsap.registerPlugin(Observer)"),
        Si || on());
      var i = t.tolerance,
        n = t.dragMinimum,
        a = t.type,
        o = t.target,
        h = t.lineHeight,
        m = t.debounce,
        R = t.preventDefault,
        k = t.onStop,
        p = t.onStopDelay,
        u = t.ignore,
        g = t.wheelSpeed,
        I = t.event,
        Y = t.onDragStart,
        J = t.onDragEnd,
        W = t.onDrag,
        le = t.onPress,
        w = t.onRelease,
        ae = t.onRight,
        N = t.onLeft,
        _ = t.onUp,
        Q = t.onDown,
        ve = t.onChangeX,
        v = t.onChangeY,
        ce = t.onChange,
        y = t.onToggleX,
        We = t.onToggleY,
        X = t.onHover,
        we = t.onHoverEnd,
        de = t.onMove,
        E = t.ignoreCheck,
        V = t.isNormalizer,
        $ = t.onGestureStart,
        l = t.onGestureEnd,
        q = t.onWheel,
        et = t.onEnable,
        bt = t.onDisable,
        Ke = t.onClick,
        gt = t.scrollSpeed,
        Re = t.capture,
        re = t.allowClicks,
        Le = t.lockAxis,
        xe = t.onLockAxis;
      ((this.target = o = He(o) || At),
        (this.vars = t),
        u && (u = be.utils.toArray(u)),
        (i = i || 1e-9),
        (n = n || 0),
        (g = g || 1),
        (gt = gt || 1),
        (a = a || "wheel,touch,pointer"),
        (m = m !== !1),
        h || (h = parseFloat(Ge.getComputedStyle(si).lineHeight) || 22));
      var xt,
        De,
        tt,
        O,
        j,
        Ie,
        Xe,
        c = this,
        Fe = 0,
        mt = 0,
        Tt = t.passive || !R,
        ne = zt(o, Be),
        Ct = zt(o, fe),
        Ot = ne(),
        Zt = Ct(),
        pe =
          ~a.indexOf("touch") &&
          !~a.indexOf("pointer") &&
          lt[0] === "pointerdown",
        kt = xi(o),
        ee = o.ownerDocument || Dt,
        it = [0, 0, 0],
        Ze = [0, 0, 0],
        _t = 0,
        ci = function () {
          return (_t = bi());
        },
        se = function (b, B) {
          return (
            ((c.event = b) && u && ~u.indexOf(b.target)) ||
            (B && pe && b.pointerType !== "touch") ||
            (E && E(b, B))
          );
        },
        Ai = function () {
          (c._vx.reset(), c._vy.reset(), De.pause(), k && k(c));
        },
        Et = function () {
          var b = (c.deltaX = zr(it)),
            B = (c.deltaY = zr(Ze)),
            f = Math.abs(b) >= i,
            C = Math.abs(B) >= i;
          (ce && (f || C) && ce(c, b, B, it, Ze),
            f &&
              (ae && c.deltaX > 0 && ae(c),
              N && c.deltaX < 0 && N(c),
              ve && ve(c),
              y && c.deltaX < 0 != Fe < 0 && y(c),
              (Fe = c.deltaX),
              (it[0] = it[1] = it[2] = 0)),
            C &&
              (Q && c.deltaY > 0 && Q(c),
              _ && c.deltaY < 0 && _(c),
              v && v(c),
              We && c.deltaY < 0 != mt < 0 && We(c),
              (mt = c.deltaY),
              (Ze[0] = Ze[1] = Ze[2] = 0)),
            (O || tt) && (de && de(c), tt && (W(c), (tt = !1)), (O = !1)),
            Ie && !(Ie = !1) && xe && xe(c),
            j && (q(c), (j = !1)),
            (xt = 0));
        },
        Jt = function (b, B, f) {
          ((it[f] += b),
            (Ze[f] += B),
            c._vx.update(b),
            c._vy.update(B),
            m ? xt || (xt = requestAnimationFrame(Et)) : Et());
        },
        Qt = function (b, B) {
          (Le &&
            !Xe &&
            ((c.axis = Xe = Math.abs(b) > Math.abs(B) ? "x" : "y"), (Ie = !0)),
            Xe !== "y" && ((it[2] += b), c._vx.update(b, !0)),
            Xe !== "x" && ((Ze[2] += B), c._vy.update(B, !0)),
            m ? xt || (xt = requestAnimationFrame(Et)) : Et());
        },
        Mt = function (b) {
          if (!se(b, 1)) {
            b = pi(b, R);
            var B = b.clientX,
              f = b.clientY,
              C = B - c.x,
              S = f - c.y,
              x = c.isDragging;
            ((c.x = B),
              (c.y = f),
              (x ||
                Math.abs(c.startX - B) >= n ||
                Math.abs(c.startY - f) >= n) &&
                (W && (tt = !0),
                x || (c.isDragging = !0),
                Qt(C, S),
                x || (Y && Y(c))));
          }
        },
        Nt = (c.onPress = function (T) {
          se(T, 1) ||
            (T && T.button) ||
            ((c.axis = Xe = null),
            De.pause(),
            (c.isPressed = !0),
            (T = pi(T)),
            (Fe = mt = 0),
            (c.startX = c.x = T.clientX),
            (c.startY = c.y = T.clientY),
            c._vx.reset(),
            c._vy.reset(),
            Pe(V ? o : ee, lt[1], Mt, Tt, !0),
            (c.deltaX = c.deltaY = 0),
            le && le(c));
        }),
        L = (c.onRelease = function (T) {
          if (!se(T, 1)) {
            Ae(V ? o : ee, lt[1], Mt, !0);
            var b = !isNaN(c.y - c.startY),
              B = c.isDragging,
              f =
                B &&
                (Math.abs(c.x - c.startX) > 3 || Math.abs(c.y - c.startY) > 3),
              C = pi(T);
            (!f &&
              b &&
              (c._vx.reset(),
              c._vy.reset(),
              R &&
                re &&
                be.delayedCall(0.08, function () {
                  if (bi() - _t > 300 && !T.defaultPrevented) {
                    if (T.target.click) T.target.click();
                    else if (ee.createEvent) {
                      var S = ee.createEvent("MouseEvents");
                      (S.initMouseEvent(
                        "click",
                        !0,
                        !0,
                        Ge,
                        1,
                        C.screenX,
                        C.screenY,
                        C.clientX,
                        C.clientY,
                        !1,
                        !1,
                        !1,
                        !1,
                        0,
                        null,
                      ),
                        T.target.dispatchEvent(S));
                    }
                  }
                })),
              (c.isDragging = c.isGesturing = c.isPressed = !1),
              k && B && !V && De.restart(!0),
              J && B && J(c),
              w && w(c, f));
          }
        }),
        Bt = function (b) {
          return (
            b.touches &&
            b.touches.length > 1 &&
            (c.isGesturing = !0) &&
            $(b, c.isDragging)
          );
        },
        rt = function () {
          return (c.isGesturing = !1) || l(c);
        },
        nt = function (b) {
          if (!se(b)) {
            var B = ne(),
              f = Ct();
            (Jt((B - Ot) * gt, (f - Zt) * gt, 1),
              (Ot = B),
              (Zt = f),
              k && De.restart(!0));
          }
        },
        st = function (b) {
          if (!se(b)) {
            ((b = pi(b, R)), q && (j = !0));
            var B =
              (b.deltaMode === 1 ? h : b.deltaMode === 2 ? Ge.innerHeight : 1) *
              g;
            (Jt(b.deltaX * B, b.deltaY * B, 0), k && !V && De.restart(!0));
          }
        },
        Yt = function (b) {
          if (!se(b)) {
            var B = b.clientX,
              f = b.clientY,
              C = B - c.x,
              S = f - c.y;
            ((c.x = B),
              (c.y = f),
              (O = !0),
              k && De.restart(!0),
              (C || S) && Qt(C, S));
          }
        },
        jt = function (b) {
          ((c.event = b), X(c));
        },
        vt = function (b) {
          ((c.event = b), we(c));
        },
        ui = function (b) {
          return se(b) || (pi(b, R) && Ke(c));
        };
      ((De = c._dc = be.delayedCall(p || 0.25, Ai).pause()),
        (c.deltaX = c.deltaY = 0),
        (c._vx = mr(0, 50, !0)),
        (c._vy = mr(0, 50, !0)),
        (c.scrollX = ne),
        (c.scrollY = Ct),
        (c.isDragging = c.isGesturing = c.isPressed = !1),
        rn(this),
        (c.enable = function (T) {
          return (
            c.isEnabled ||
              (Pe(kt ? ee : o, "scroll", gr),
              a.indexOf("scroll") >= 0 && Pe(kt ? ee : o, "scroll", nt, Tt, Re),
              a.indexOf("wheel") >= 0 && Pe(o, "wheel", st, Tt, Re),
              ((a.indexOf("touch") >= 0 && en) || a.indexOf("pointer") >= 0) &&
                (Pe(o, lt[0], Nt, Tt, Re),
                Pe(ee, lt[2], L),
                Pe(ee, lt[3], L),
                re && Pe(o, "click", ci, !0, !0),
                Ke && Pe(o, "click", ui),
                $ && Pe(ee, "gesturestart", Bt),
                l && Pe(ee, "gestureend", rt),
                X && Pe(o, Ht + "enter", jt),
                we && Pe(o, Ht + "leave", vt),
                de && Pe(o, Ht + "move", Yt)),
              (c.isEnabled = !0),
              T && T.type && Nt(T),
              et && et(c)),
            c
          );
        }),
        (c.disable = function () {
          c.isEnabled &&
            (ni.filter(function (T) {
              return T !== c && xi(T.target);
            }).length || Ae(kt ? ee : o, "scroll", gr),
            c.isPressed &&
              (c._vx.reset(), c._vy.reset(), Ae(V ? o : ee, lt[1], Mt, !0)),
            Ae(kt ? ee : o, "scroll", nt, Re),
            Ae(o, "wheel", st, Re),
            Ae(o, lt[0], Nt, Re),
            Ae(ee, lt[2], L),
            Ae(ee, lt[3], L),
            Ae(o, "click", ci, !0),
            Ae(o, "click", ui),
            Ae(ee, "gesturestart", Bt),
            Ae(ee, "gestureend", rt),
            Ae(o, Ht + "enter", jt),
            Ae(o, Ht + "leave", vt),
            Ae(o, Ht + "move", Yt),
            (c.isEnabled = c.isPressed = c.isDragging = !1),
            bt && bt(c));
        }),
        (c.kill = c.revert =
          function () {
            c.disable();
            var T = ni.indexOf(c);
            (T >= 0 && ni.splice(T, 1), yt === c && (yt = 0));
          }),
        ni.push(c),
        V && xi(o) && (yt = c),
        c.enable(I));
    }),
    Dn(s, [
      {
        key: "velocityX",
        get: function () {
          return this._vx.getVelocity();
        },
      },
      {
        key: "velocityY",
        get: function () {
          return this._vy.getVelocity();
        },
      },
    ]),
    s
  );
})();
ie.version = "3.12.5";
ie.create = function (s) {
  return new ie(s);
};
ie.register = ln;
ie.getAll = function () {
  return ni.slice();
};
ie.getById = function (s) {
  return ni.filter(function (e) {
    return e.vars.id === s;
  })[0];
};
nn() && be.registerPlugin(ie);
/*!
 * ScrollTrigger 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var d,
  ii,
  z,
  K,
  at,
  F,
  an,
  tr,
  Li,
  Ti,
  mi,
  Yi,
  Ee,
  sr,
  _r,
  Oe,
  Or,
  Nr,
  ri,
  cn,
  lr,
  un,
  ze,
  vr,
  hn,
  fn,
  Lt,
  wr,
  Cr,
  oi,
  kr,
  ir,
  yr,
  ar,
  Ii = 1,
  Me = Date.now,
  cr = Me(),
  je = 0,
  _i = 0,
  Br = function (e, r, t) {
    var i = qe(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
    return ((t["_" + r + "Clamp"] = i), i ? e.substr(6, e.length - 7) : e);
  },
  Yr = function (e, r) {
    return r && (!qe(e) || e.substr(0, 6) !== "clamp(")
      ? "clamp(" + e + ")"
      : e;
  },
  Pn = function s() {
    return _i && requestAnimationFrame(s);
  },
  Ir = function () {
    return (sr = 1);
  },
  Hr = function () {
    return (sr = 0);
  },
  ft = function (e) {
    return e;
  },
  vi = function (e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  },
  dn = function () {
    return typeof window < "u";
  },
  pn = function () {
    return d || (dn() && (d = window.gsap) && d.registerPlugin && d);
  },
  qt = function (e) {
    return !!~an.indexOf(e);
  },
  gn = function (e) {
    return (
      (e === "Height" ? kr : z["inner" + e]) ||
      at["client" + e] ||
      F["client" + e]
    );
  },
  mn = function (e) {
    return (
      Pt(e, "getBoundingClientRect") ||
      (qt(e)
        ? function () {
            return ((ji.width = z.innerWidth), (ji.height = kr), ji);
          }
        : function () {
            return wt(e);
          })
    );
  },
  zn = function (e, r, t) {
    var i = t.d,
      n = t.d2,
      a = t.a;
    return (a = Pt(e, "getBoundingClientRect"))
      ? function () {
          return a()[i];
        }
      : function () {
          return (r ? gn(n) : e["client" + n]) || 0;
        };
  },
  On = function (e, r) {
    return !r || ~pt.indexOf(e)
      ? mn(e)
      : function () {
          return ji;
        };
  },
  dt = function (e, r) {
    var t = r.s,
      i = r.d2,
      n = r.d,
      a = r.a;
    return Math.max(
      0,
      (t = "scroll" + i) && (a = Pt(e, t))
        ? a() - mn(e)()[n]
        : qt(e)
          ? (at[t] || F[t]) - gn(i)
          : e[t] - e["offset" + i],
    );
  },
  Hi = function (e, r) {
    for (var t = 0; t < ri.length; t += 3)
      (!r || ~r.indexOf(ri[t + 1])) && e(ri[t], ri[t + 1], ri[t + 2]);
  },
  qe = function (e) {
    return typeof e == "string";
  },
  Ye = function (e) {
    return typeof e == "function";
  },
  wi = function (e) {
    return typeof e == "number";
  },
  Wt = function (e) {
    return typeof e == "object";
  },
  gi = function (e, r, t) {
    return e && e.progress(r ? 0 : 1) && t && e.pause();
  },
  ur = function (e, r) {
    if (e.enabled) {
      var t = e._ctx
        ? e._ctx.add(function () {
            return r(e);
          })
        : r(e);
      t && t.totalTime && (e.callbackAnimation = t);
    }
  },
  ei = Math.abs,
  _n = "left",
  vn = "top",
  Er = "right",
  Mr = "bottom",
  Vt = "width",
  $t = "height",
  Ci = "Right",
  ki = "Left",
  Ei = "Top",
  Mi = "Bottom",
  oe = "padding",
  Je = "margin",
  ai = "Width",
  Rr = "Height",
  he = "px",
  Qe = function (e) {
    return z.getComputedStyle(e);
  },
  Nn = function (e) {
    var r = Qe(e).position;
    e.style.position = r === "absolute" || r === "fixed" ? r : "relative";
  },
  Wr = function (e, r) {
    for (var t in r) t in e || (e[t] = r[t]);
    return e;
  },
  wt = function (e, r) {
    var t =
        r &&
        Qe(e)[_r] !== "matrix(1, 0, 0, 1, 0, 0)" &&
        d
          .to(e, {
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            skewX: 0,
            skewY: 0,
          })
          .progress(1),
      i = e.getBoundingClientRect();
    return (t && t.progress(0).kill(), i);
  },
  rr = function (e, r) {
    var t = r.d2;
    return e["offset" + t] || e["client" + t] || 0;
  },
  wn = function (e) {
    var r = [],
      t = e.labels,
      i = e.duration(),
      n;
    for (n in t) r.push(t[n] / i);
    return r;
  },
  Bn = function (e) {
    return function (r) {
      return d.utils.snap(wn(e), r);
    };
  },
  Lr = function (e) {
    var r = d.utils.snap(e),
      t =
        Array.isArray(e) &&
        e.slice(0).sort(function (i, n) {
          return i - n;
        });
    return t
      ? function (i, n, a) {
          a === void 0 && (a = 0.001);
          var o;
          if (!n) return r(i);
          if (n > 0) {
            for (i -= a, o = 0; o < t.length; o++) if (t[o] >= i) return t[o];
            return t[o - 1];
          } else for (o = t.length, i += a; o--;) if (t[o] <= i) return t[o];
          return t[0];
        }
      : function (i, n, a) {
          a === void 0 && (a = 0.001);
          var o = r(i);
          return !n || Math.abs(o - i) < a || o - i < 0 == n < 0
            ? o
            : r(n < 0 ? i - e : i + e);
        };
  },
  Yn = function (e) {
    return function (r, t) {
      return Lr(wn(e))(r, t.direction);
    };
  },
  Wi = function (e, r, t, i) {
    return t.split(",").forEach(function (n) {
      return e(r, n, i);
    });
  },
  _e = function (e, r, t, i, n) {
    return e.addEventListener(r, t, { passive: !i, capture: !!n });
  },
  me = function (e, r, t, i) {
    return e.removeEventListener(r, t, !!i);
  },
  Xi = function (e, r, t) {
    ((t = t && t.wheelHandler), t && (e(r, "wheel", t), e(r, "touchmove", t)));
  },
  Xr = {
    startColor: "green",
    endColor: "red",
    indent: 0,
    fontSize: "16px",
    fontWeight: "normal",
  },
  Fi = { toggleActions: "play", anticipatePin: 0 },
  nr = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 },
  Ki = function (e, r) {
    if (qe(e)) {
      var t = e.indexOf("="),
        i = ~t ? +(e.charAt(t - 1) + 1) * parseFloat(e.substr(t + 1)) : 0;
      (~t && (e.indexOf("%") > t && (i *= r / 100), (e = e.substr(0, t - 1))),
        (e =
          i +
          (e in nr
            ? nr[e] * r
            : ~e.indexOf("%")
              ? (parseFloat(e) * r) / 100
              : parseFloat(e) || 0)));
    }
    return e;
  },
  Vi = function (e, r, t, i, n, a, o, h) {
    var m = n.startColor,
      R = n.endColor,
      k = n.fontSize,
      p = n.indent,
      u = n.fontWeight,
      g = K.createElement("div"),
      I = qt(t) || Pt(t, "pinType") === "fixed",
      Y = e.indexOf("scroller") !== -1,
      J = I ? F : t,
      W = e.indexOf("start") !== -1,
      le = W ? m : R,
      w =
        "border-color:" +
        le +
        ";font-size:" +
        k +
        ";color:" +
        le +
        ";font-weight:" +
        u +
        ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    return (
      (w += "position:" + ((Y || h) && I ? "fixed;" : "absolute;")),
      (Y || h || !I) &&
        (w += (i === fe ? Er : Mr) + ":" + (a + parseFloat(p)) + "px;"),
      o &&
        (w +=
          "box-sizing:border-box;text-align:left;width:" +
          o.offsetWidth +
          "px;"),
      (g._isStart = W),
      g.setAttribute("class", "gsap-marker-" + e + (r ? " marker-" + r : "")),
      (g.style.cssText = w),
      (g.innerText = r || r === 0 ? e + "-" + r : e),
      J.children[0] ? J.insertBefore(g, J.children[0]) : J.appendChild(g),
      (g._offset = g["offset" + i.op.d2]),
      Zi(g, 0, i, W),
      g
    );
  },
  Zi = function (e, r, t, i) {
    var n = { display: "block" },
      a = t[i ? "os2" : "p2"],
      o = t[i ? "p2" : "os2"];
    ((e._isFlipped = i),
      (n[t.a + "Percent"] = i ? -100 : 0),
      (n[t.a] = i ? "1px" : 0),
      (n["border" + a + ai] = 1),
      (n["border" + o + ai] = 0),
      (n[t.p] = r + "px"),
      d.set(e, n));
  },
  M = [],
  Sr = {},
  Di,
  Fr = function () {
    return Me() - je > 34 && (Di || (Di = requestAnimationFrame(St)));
  },
  ti = function () {
    (!ze || !ze.isPressed || ze.startX > F.clientWidth) &&
      (D.cache++,
      ze ? Di || (Di = requestAnimationFrame(St)) : St(),
      je || Kt("scrollStart"),
      (je = Me()));
  },
  hr = function () {
    ((fn = z.innerWidth), (hn = z.innerHeight));
  },
  yi = function () {
    (D.cache++,
      !Ee &&
        !un &&
        !K.fullscreenElement &&
        !K.webkitFullscreenElement &&
        (!vr ||
          fn !== z.innerWidth ||
          Math.abs(z.innerHeight - hn) > z.innerHeight * 0.25) &&
        tr.restart(!0));
  },
  Gt = {},
  In = [],
  yn = function s() {
    return me(A, "scrollEnd", s) || Ft(!0);
  },
  Kt = function (e) {
    return (
      (Gt[e] &&
        Gt[e].map(function (r) {
          return r();
        })) ||
      In
    );
  },
  Ue = [],
  Sn = function (e) {
    for (var r = 0; r < Ue.length; r += 5)
      (!e || (Ue[r + 4] && Ue[r + 4].query === e)) &&
        ((Ue[r].style.cssText = Ue[r + 1]),
        Ue[r].getBBox && Ue[r].setAttribute("transform", Ue[r + 2] || ""),
        (Ue[r + 3].uncache = 1));
  },
  Dr = function (e, r) {
    var t;
    for (Oe = 0; Oe < M.length; Oe++)
      ((t = M[Oe]),
        t && (!r || t._ctx === r) && (e ? t.kill(1) : t.revert(!0, !0)));
    ((ir = !0), r && Sn(r), r || Kt("revert"));
  },
  bn = function (e, r) {
    (D.cache++,
      (r || !Ne) &&
        D.forEach(function (t) {
          return Ye(t) && t.cacheID++ && (t.rec = 0);
        }),
      qe(e) && (z.history.scrollRestoration = Cr = e));
  },
  Ne,
  Ut = 0,
  Vr,
  Hn = function () {
    if (Vr !== Ut) {
      var e = (Vr = Ut);
      requestAnimationFrame(function () {
        return e === Ut && Ft(!0);
      });
    }
  },
  xn = function () {
    (F.appendChild(oi),
      (kr = (!ze && oi.offsetHeight) || z.innerHeight),
      F.removeChild(oi));
  },
  $r = function (e) {
    return Li(
      ".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end",
    ).forEach(function (r) {
      return (r.style.display = e ? "none" : "block");
    });
  },
  Ft = function (e, r) {
    if (je && !e && !ir) {
      _e(A, "scrollEnd", yn);
      return;
    }
    (xn(),
      (Ne = A.isRefreshing = !0),
      D.forEach(function (i) {
        return Ye(i) && ++i.cacheID && (i.rec = i());
      }));
    var t = Kt("refreshInit");
    (cn && A.sort(),
      r || Dr(),
      D.forEach(function (i) {
        Ye(i) && (i.smooth && (i.target.style.scrollBehavior = "auto"), i(0));
      }),
      M.slice(0).forEach(function (i) {
        return i.refresh();
      }),
      (ir = !1),
      M.forEach(function (i) {
        if (i._subPinOffset && i.pin) {
          var n = i.vars.horizontal ? "offsetWidth" : "offsetHeight",
            a = i.pin[n];
          (i.revert(!0, 1), i.adjustPinSpacing(i.pin[n] - a), i.refresh());
        }
      }),
      (yr = 1),
      $r(!0),
      M.forEach(function (i) {
        var n = dt(i.scroller, i._dir),
          a = i.vars.end === "max" || (i._endClamp && i.end > n),
          o = i._startClamp && i.start >= n;
        (a || o) &&
          i.setPositions(
            o ? n - 1 : i.start,
            a ? Math.max(o ? n : i.start + 1, n) : i.end,
            !0,
          );
      }),
      $r(!1),
      (yr = 0),
      t.forEach(function (i) {
        return i && i.render && i.render(-1);
      }),
      D.forEach(function (i) {
        Ye(i) &&
          (i.smooth &&
            requestAnimationFrame(function () {
              return (i.target.style.scrollBehavior = "smooth");
            }),
          i.rec && i(i.rec));
      }),
      bn(Cr, 1),
      tr.pause(),
      Ut++,
      (Ne = 2),
      St(2),
      M.forEach(function (i) {
        return Ye(i.vars.onRefresh) && i.vars.onRefresh(i);
      }),
      (Ne = A.isRefreshing = !1),
      Kt("refresh"));
  },
  br = 0,
  Ji = 1,
  Ri,
  St = function (e) {
    if (e === 2 || (!Ne && !ir)) {
      ((A.isUpdating = !0), Ri && Ri.update(0));
      var r = M.length,
        t = Me(),
        i = t - cr >= 50,
        n = r && M[0].scroll();
      if (
        ((Ji = br > n ? -1 : 1),
        Ne || (br = n),
        i &&
          (je && !sr && t - je > 200 && ((je = 0), Kt("scrollEnd")),
          (mi = cr),
          (cr = t)),
        Ji < 0)
      ) {
        for (Oe = r; Oe-- > 0;) M[Oe] && M[Oe].update(0, i);
        Ji = 1;
      } else for (Oe = 0; Oe < r; Oe++) M[Oe] && M[Oe].update(0, i);
      A.isUpdating = !1;
    }
    Di = 0;
  },
  xr = [
    _n,
    vn,
    Mr,
    Er,
    Je + Mi,
    Je + Ci,
    Je + Ei,
    Je + ki,
    "display",
    "flexShrink",
    "float",
    "zIndex",
    "gridColumnStart",
    "gridColumnEnd",
    "gridRowStart",
    "gridRowEnd",
    "gridArea",
    "justifySelf",
    "alignSelf",
    "placeSelf",
    "order",
  ],
  Qi = xr.concat([
    Vt,
    $t,
    "boxSizing",
    "max" + ai,
    "max" + Rr,
    "position",
    Je,
    oe,
    oe + Ei,
    oe + Ci,
    oe + Mi,
    oe + ki,
  ]),
  Wn = function (e, r, t) {
    li(t);
    var i = e._gsap;
    if (i.spacerIsNative) li(i.spacerState);
    else if (e._gsap.swappedIn) {
      var n = r.parentNode;
      n && (n.insertBefore(e, r), n.removeChild(r));
    }
    e._gsap.swappedIn = !1;
  },
  fr = function (e, r, t, i) {
    if (!e._gsap.swappedIn) {
      for (var n = xr.length, a = r.style, o = e.style, h; n--;)
        ((h = xr[n]), (a[h] = t[h]));
      ((a.position = t.position === "absolute" ? "absolute" : "relative"),
        t.display === "inline" && (a.display = "inline-block"),
        (o[Mr] = o[Er] = "auto"),
        (a.flexBasis = t.flexBasis || "auto"),
        (a.overflow = "visible"),
        (a.boxSizing = "border-box"),
        (a[Vt] = rr(e, Be) + he),
        (a[$t] = rr(e, fe) + he),
        (a[oe] = o[Je] = o[vn] = o[_n] = "0"),
        li(i),
        (o[Vt] = o["max" + ai] = t[Vt]),
        (o[$t] = o["max" + Rr] = t[$t]),
        (o[oe] = t[oe]),
        e.parentNode !== r &&
          (e.parentNode.insertBefore(r, e), r.appendChild(e)),
        (e._gsap.swappedIn = !0));
    }
  },
  Xn = /([A-Z])/g,
  li = function (e) {
    if (e) {
      var r = e.t.style,
        t = e.length,
        i = 0,
        n,
        a;
      for ((e.t._gsap || d.core.getCache(e.t)).uncache = 1; i < t; i += 2)
        ((a = e[i + 1]),
          (n = e[i]),
          a
            ? (r[n] = a)
            : r[n] && r.removeProperty(n.replace(Xn, "-$1").toLowerCase()));
    }
  },
  $i = function (e) {
    for (var r = Qi.length, t = e.style, i = [], n = 0; n < r; n++)
      i.push(Qi[n], t[Qi[n]]);
    return ((i.t = e), i);
  },
  Fn = function (e, r, t) {
    for (var i = [], n = e.length, a = t ? 8 : 0, o; a < n; a += 2)
      ((o = e[a]), i.push(o, o in r ? r[o] : e[a + 1]));
    return ((i.t = e.t), i);
  },
  ji = { left: 0, top: 0 },
  Ur = function (e, r, t, i, n, a, o, h, m, R, k, p, u, g) {
    (Ye(e) && (e = e(h)),
      qe(e) &&
        e.substr(0, 3) === "max" &&
        (e = p + (e.charAt(4) === "=" ? Ki("0" + e.substr(3), t) : 0)));
    var I = u ? u.time() : 0,
      Y,
      J,
      W;
    if ((u && u.seek(0), isNaN(e) || (e = +e), wi(e)))
      (u &&
        (e = d.utils.mapRange(
          u.scrollTrigger.start,
          u.scrollTrigger.end,
          0,
          p,
          e,
        )),
        o && Zi(o, t, i, !0));
    else {
      Ye(r) && (r = r(h));
      var le = (e || "0").split(" "),
        w,
        ae,
        N,
        _;
      ((W = He(r, h) || F),
        (w = wt(W) || {}),
        (!w || (!w.left && !w.top)) &&
          Qe(W).display === "none" &&
          ((_ = W.style.display),
          (W.style.display = "block"),
          (w = wt(W)),
          _ ? (W.style.display = _) : W.style.removeProperty("display")),
        (ae = Ki(le[0], w[i.d])),
        (N = Ki(le[1] || "0", t)),
        (e = w[i.p] - m[i.p] - R + ae + n - N),
        o && Zi(o, N, i, t - N < 20 || (o._isStart && N > 20)),
        (t -= t - N));
    }
    if ((g && ((h[g] = e || -0.001), e < 0 && (e = 0)), a)) {
      var Q = e + t,
        ve = a._isStart;
      ((Y = "scroll" + i.d2),
        Zi(
          a,
          Q,
          i,
          (ve && Q > 20) ||
            (!ve && (k ? Math.max(F[Y], at[Y]) : a.parentNode[Y]) <= Q + 1),
        ),
        k &&
          ((m = wt(o)),
          k && (a.style[i.op.p] = m[i.op.p] - i.op.m - a._offset + he)));
    }
    return (
      u &&
        W &&
        ((Y = wt(W)),
        u.seek(p),
        (J = wt(W)),
        (u._caScrollDist = Y[i.p] - J[i.p]),
        (e = (e / u._caScrollDist) * p)),
      u && u.seek(I),
      u ? e : Math.round(e)
    );
  },
  Vn = /(webkit|moz|length|cssText|inset)/i,
  qr = function (e, r, t, i) {
    if (e.parentNode !== r) {
      var n = e.style,
        a,
        o;
      if (r === F) {
        ((e._stOrig = n.cssText), (o = Qe(e)));
        for (a in o)
          !+a &&
            !Vn.test(a) &&
            o[a] &&
            typeof n[a] == "string" &&
            a !== "0" &&
            (n[a] = o[a]);
        ((n.top = t), (n.left = i));
      } else n.cssText = e._stOrig;
      ((d.core.getCache(e).uncache = 1), r.appendChild(e));
    }
  },
  Tn = function (e, r, t) {
    var i = r,
      n = i;
    return function (a) {
      var o = Math.round(e());
      return (
        o !== i &&
          o !== n &&
          Math.abs(o - i) > 3 &&
          Math.abs(o - n) > 3 &&
          ((a = o), t && t()),
        (n = i),
        (i = a),
        a
      );
    };
  },
  Ui = function (e, r, t) {
    var i = {};
    ((i[r.p] = "+=" + t), d.set(e, i));
  },
  Gr = function (e, r) {
    var t = zt(e, r),
      i = "_scroll" + r.p2,
      n = function a(o, h, m, R, k) {
        var p = a.tween,
          u = h.onComplete,
          g = {};
        m = m || t();
        var I = Tn(t, m, function () {
          (p.kill(), (a.tween = 0));
        });
        return (
          (k = (R && k) || 0),
          (R = R || o - m),
          p && p.kill(),
          (h[i] = o),
          (h.inherit = !1),
          (h.modifiers = g),
          (g[i] = function () {
            return I(m + R * p.ratio + k * p.ratio * p.ratio);
          }),
          (h.onUpdate = function () {
            (D.cache++, a.tween && St());
          }),
          (h.onComplete = function () {
            ((a.tween = 0), u && u.call(p));
          }),
          (p = a.tween = d.to(e, h)),
          p
        );
      };
    return (
      (e[i] = t),
      (t.wheelHandler = function () {
        return n.tween && n.tween.kill() && (n.tween = 0);
      }),
      _e(e, "wheel", t.wheelHandler),
      A.isTouch && _e(e, "touchmove", t.wheelHandler),
      n
    );
  },
  A = (function () {
    function s(r, t) {
      (ii ||
        s.register(d) ||
        console.warn("Please gsap.registerPlugin(ScrollTrigger)"),
        wr(this),
        this.init(r, t));
    }
    var e = s.prototype;
    return (
      (e.init = function (t, i) {
        if (
          ((this.progress = this.start = 0),
          this.vars && this.kill(!0, !0),
          !_i)
        ) {
          this.update = this.refresh = this.kill = ft;
          return;
        }
        t = Wr(qe(t) || wi(t) || t.nodeType ? { trigger: t } : t, Fi);
        var n = t,
          a = n.onUpdate,
          o = n.toggleClass,
          h = n.id,
          m = n.onToggle,
          R = n.onRefresh,
          k = n.scrub,
          p = n.trigger,
          u = n.pin,
          g = n.pinSpacing,
          I = n.invalidateOnRefresh,
          Y = n.anticipatePin,
          J = n.onScrubComplete,
          W = n.onSnapComplete,
          le = n.once,
          w = n.snap,
          ae = n.pinReparent,
          N = n.pinSpacer,
          _ = n.containerAnimation,
          Q = n.fastScrollEnd,
          ve = n.preventOverlaps,
          v =
            t.horizontal || (t.containerAnimation && t.horizontal !== !1)
              ? Be
              : fe,
          ce = !k && k !== 0,
          y = He(t.scroller || z),
          We = d.core.getCache(y),
          X = qt(y),
          we =
            ("pinType" in t
              ? t.pinType
              : Pt(y, "pinType") || (X && "fixed")) === "fixed",
          de = [t.onEnter, t.onLeave, t.onEnterBack, t.onLeaveBack],
          E = ce && t.toggleActions.split(" "),
          V = "markers" in t ? t.markers : Fi.markers,
          $ = X ? 0 : parseFloat(Qe(y)["border" + v.p2 + ai]) || 0,
          l = this,
          q =
            t.onRefreshInit &&
            function () {
              return t.onRefreshInit(l);
            },
          et = zn(y, X, v),
          bt = On(y, X),
          Ke = 0,
          gt = 0,
          Re = 0,
          re = zt(y, v),
          Le,
          xe,
          xt,
          De,
          tt,
          O,
          j,
          Ie,
          Xe,
          c,
          Fe,
          mt,
          Tt,
          ne,
          Ct,
          Ot,
          Zt,
          pe,
          kt,
          ee,
          it,
          Ze,
          _t,
          ci,
          se,
          Ai,
          Et,
          Jt,
          Qt,
          Mt,
          Nt,
          L,
          Bt,
          rt,
          nt,
          st,
          Yt,
          jt,
          vt;
        if (
          ((l._startClamp = l._endClamp = !1),
          (l._dir = v),
          (Y *= 45),
          (l.scroller = y),
          (l.scroll = _ ? _.time.bind(_) : re),
          (De = re()),
          (l.vars = t),
          (i = i || t.animation),
          "refreshPriority" in t &&
            ((cn = 1), t.refreshPriority === -9999 && (Ri = l)),
          (We.tweenScroll = We.tweenScroll || {
            top: Gr(y, fe),
            left: Gr(y, Be),
          }),
          (l.tweenTo = Le = We.tweenScroll[v.p]),
          (l.scrubDuration = function (f) {
            ((Bt = wi(f) && f),
              Bt
                ? L
                  ? L.duration(f)
                  : (L = d.to(i, {
                      ease: "expo",
                      totalProgress: "+=0",
                      inherit: !1,
                      duration: Bt,
                      paused: !0,
                      onComplete: function () {
                        return J && J(l);
                      },
                    }))
                : (L && L.progress(1).kill(), (L = 0)));
          }),
          i &&
            ((i.vars.lazy = !1),
            (i._initted && !l.isReverted) ||
              (i.vars.immediateRender !== !1 &&
                t.immediateRender !== !1 &&
                i.duration() &&
                i.render(0, !0, !0)),
            (l.animation = i.pause()),
            (i.scrollTrigger = l),
            l.scrubDuration(k),
            (Mt = 0),
            h || (h = i.vars.id)),
          w &&
            ((!Wt(w) || w.push) && (w = { snapTo: w }),
            "scrollBehavior" in F.style &&
              d.set(X ? [F, at] : y, { scrollBehavior: "auto" }),
            D.forEach(function (f) {
              return (
                Ye(f) &&
                f.target === (X ? K.scrollingElement || at : y) &&
                (f.smooth = !1)
              );
            }),
            (xt = Ye(w.snapTo)
              ? w.snapTo
              : w.snapTo === "labels"
                ? Bn(i)
                : w.snapTo === "labelsDirectional"
                  ? Yn(i)
                  : w.directional !== !1
                    ? function (f, C) {
                        return Lr(w.snapTo)(
                          f,
                          Me() - gt < 500 ? 0 : C.direction,
                        );
                      }
                    : d.utils.snap(w.snapTo)),
            (rt = w.duration || { min: 0.1, max: 2 }),
            (rt = Wt(rt) ? Ti(rt.min, rt.max) : Ti(rt, rt)),
            (nt = d
              .delayedCall(w.delay || Bt / 2 || 0.1, function () {
                var f = re(),
                  C = Me() - gt < 500,
                  S = Le.tween;
                if (
                  (C || Math.abs(l.getVelocity()) < 10) &&
                  !S &&
                  !sr &&
                  Ke !== f
                ) {
                  var x = (f - O) / ne,
                    ge = i && !ce ? i.totalProgress() : x,
                    P = C ? 0 : ((ge - Nt) / (Me() - mi)) * 1e3 || 0,
                    te = d.utils.clamp(-x, 1 - x, (ei(P / 2) * P) / 0.185),
                    Te = x + (w.inertia === !1 ? 0 : te),
                    Z,
                    U,
                    H = w,
                    ot = H.onStart,
                    G = H.onInterrupt,
                    Ve = H.onComplete;
                  if (
                    ((Z = xt(Te, l)),
                    wi(Z) || (Z = Te),
                    (U = Math.round(O + Z * ne)),
                    f <= j && f >= O && U !== f)
                  ) {
                    if (S && !S._initted && S.data <= ei(U - f)) return;
                    (w.inertia === !1 && (te = Z - x),
                      Le(
                        U,
                        {
                          duration: rt(
                            ei(
                              (Math.max(ei(Te - ge), ei(Z - ge)) * 0.185) /
                                P /
                                0.05 || 0,
                            ),
                          ),
                          ease: w.ease || "power3",
                          data: ei(U - f),
                          onInterrupt: function () {
                            return nt.restart(!0) && G && G(l);
                          },
                          onComplete: function () {
                            (l.update(),
                              (Ke = re()),
                              i &&
                                (L
                                  ? L.resetTo(
                                      "totalProgress",
                                      Z,
                                      i._tTime / i._tDur,
                                    )
                                  : i.progress(Z)),
                              (Mt = Nt =
                                i && !ce ? i.totalProgress() : l.progress),
                              W && W(l),
                              Ve && Ve(l));
                          },
                        },
                        f,
                        te * ne,
                        U - f - te * ne,
                      ),
                      ot && ot(l, Le.tween));
                  }
                } else l.isActive && Ke !== f && nt.restart(!0);
              })
              .pause())),
          h && (Sr[h] = l),
          (p = l.trigger = He(p || (u !== !0 && u))),
          (vt = p && p._gsap && p._gsap.stRevert),
          vt && (vt = vt(l)),
          (u = u === !0 ? p : He(u)),
          qe(o) && (o = { targets: p, className: o }),
          u &&
            (g === !1 ||
              g === Je ||
              (g =
                !g &&
                u.parentNode &&
                u.parentNode.style &&
                Qe(u.parentNode).display === "flex"
                  ? !1
                  : oe),
            (l.pin = u),
            (xe = d.core.getCache(u)),
            xe.spacer
              ? (Ct = xe.pinState)
              : (N &&
                  ((N = He(N)),
                  N && !N.nodeType && (N = N.current || N.nativeElement),
                  (xe.spacerIsNative = !!N),
                  N && (xe.spacerState = $i(N))),
                (xe.spacer = pe = N || K.createElement("div")),
                pe.classList.add("pin-spacer"),
                h && pe.classList.add("pin-spacer-" + h),
                (xe.pinState = Ct = $i(u))),
            t.force3D !== !1 && d.set(u, { force3D: !0 }),
            (l.spacer = pe = xe.spacer),
            (Qt = Qe(u)),
            (ci = Qt[g + v.os2]),
            (ee = d.getProperty(u)),
            (it = d.quickSetter(u, v.a, he)),
            fr(u, pe, Qt),
            (Zt = $i(u))),
          V)
        ) {
          ((mt = Wt(V) ? Wr(V, Xr) : Xr),
            (c = Vi("scroller-start", h, y, v, mt, 0)),
            (Fe = Vi("scroller-end", h, y, v, mt, 0, c)),
            (kt = c["offset" + v.op.d2]));
          var ui = He(Pt(y, "content") || y);
          ((Ie = this.markerStart = Vi("start", h, ui, v, mt, kt, 0, _)),
            (Xe = this.markerEnd = Vi("end", h, ui, v, mt, kt, 0, _)),
            _ && (jt = d.quickSetter([Ie, Xe], v.a, he)),
            !we &&
              !(pt.length && Pt(y, "fixedMarkers") === !0) &&
              (Nn(X ? F : y),
              d.set([c, Fe], { force3D: !0 }),
              (Ai = d.quickSetter(c, v.a, he)),
              (Jt = d.quickSetter(Fe, v.a, he))));
        }
        if (_) {
          var T = _.vars.onUpdate,
            b = _.vars.onUpdateParams;
          _.eventCallback("onUpdate", function () {
            (l.update(0, 0, 1), T && T.apply(_, b || []));
          });
        }
        if (
          ((l.previous = function () {
            return M[M.indexOf(l) - 1];
          }),
          (l.next = function () {
            return M[M.indexOf(l) + 1];
          }),
          (l.revert = function (f, C) {
            if (!C) return l.kill(!0);
            var S = f !== !1 || !l.enabled,
              x = Ee;
            S !== l.isReverted &&
              (S &&
                ((st = Math.max(re(), l.scroll.rec || 0)),
                (Re = l.progress),
                (Yt = i && i.progress())),
              Ie &&
                [Ie, Xe, c, Fe].forEach(function (ge) {
                  return (ge.style.display = S ? "none" : "block");
                }),
              S && ((Ee = l), l.update(S)),
              u &&
                (!ae || !l.isActive) &&
                (S ? Wn(u, pe, Ct) : fr(u, pe, Qe(u), se)),
              S || l.update(S),
              (Ee = x),
              (l.isReverted = S));
          }),
          (l.refresh = function (f, C, S, x) {
            if (!((Ee || !l.enabled) && !C)) {
              if (u && f && je) {
                _e(s, "scrollEnd", yn);
                return;
              }
              (!Ne && q && q(l),
                (Ee = l),
                Le.tween && !S && (Le.tween.kill(), (Le.tween = 0)),
                L && L.pause(),
                I && i && i.revert({ kill: !1 }).invalidate(),
                l.isReverted || l.revert(!0, !0),
                (l._subPinOffset = !1));
              var ge = et(),
                P = bt(),
                te = _ ? _.duration() : dt(y, v),
                Te = ne <= 0.01,
                Z = 0,
                U = x || 0,
                H = Wt(S) ? S.end : t.end,
                ot = t.endTrigger || p,
                G = Wt(S)
                  ? S.start
                  : t.start || (t.start === 0 || !p ? 0 : u ? "0 0" : "0 100%"),
                Ve = (l.pinnedContainer =
                  t.pinnedContainer && He(t.pinnedContainer, l)),
                ct = (p && Math.max(0, M.indexOf(l))) || 0,
                ye = ct,
                Se,
                Ce,
                It,
                Pi,
                ke,
                ue,
                ut,
                or,
                Ar,
                hi,
                ht,
                fi,
                zi;
              for (
                V &&
                Wt(S) &&
                ((fi = d.getProperty(c, v.p)), (zi = d.getProperty(Fe, v.p)));
                ye--;
              )
                ((ue = M[ye]),
                  ue.end || ue.refresh(0, 1) || (Ee = l),
                  (ut = ue.pin),
                  ut &&
                    (ut === p || ut === u || ut === Ve) &&
                    !ue.isReverted &&
                    (hi || (hi = []), hi.unshift(ue), ue.revert(!0, !0)),
                  ue !== M[ye] && (ct--, ye--));
              for (
                Ye(G) && (G = G(l)),
                  G = Br(G, "start", l),
                  O =
                    Ur(
                      G,
                      p,
                      ge,
                      v,
                      re(),
                      Ie,
                      c,
                      l,
                      P,
                      $,
                      we,
                      te,
                      _,
                      l._startClamp && "_startClamp",
                    ) || (u ? -0.001 : 0),
                  Ye(H) && (H = H(l)),
                  qe(H) &&
                    !H.indexOf("+=") &&
                    (~H.indexOf(" ")
                      ? (H = (qe(G) ? G.split(" ")[0] : "") + H)
                      : ((Z = Ki(H.substr(2), ge)),
                        (H = qe(G)
                          ? G
                          : (_
                              ? d.utils.mapRange(
                                  0,
                                  _.duration(),
                                  _.scrollTrigger.start,
                                  _.scrollTrigger.end,
                                  O,
                                )
                              : O) + Z),
                        (ot = p))),
                  H = Br(H, "end", l),
                  j =
                    Math.max(
                      O,
                      Ur(
                        H || (ot ? "100% 0" : te),
                        ot,
                        ge,
                        v,
                        re() + Z,
                        Xe,
                        Fe,
                        l,
                        P,
                        $,
                        we,
                        te,
                        _,
                        l._endClamp && "_endClamp",
                      ),
                    ) || -0.001,
                  Z = 0,
                  ye = ct;
                ye--;
              )
                ((ue = M[ye]),
                  (ut = ue.pin),
                  ut &&
                    ue.start - ue._pinPush <= O &&
                    !_ &&
                    ue.end > 0 &&
                    ((Se =
                      ue.end -
                      (l._startClamp ? Math.max(0, ue.start) : ue.start)),
                    ((ut === p && ue.start - ue._pinPush < O) || ut === Ve) &&
                      isNaN(G) &&
                      (Z += Se * (1 - ue.progress)),
                    ut === u && (U += Se)));
              if (
                ((O += Z),
                (j += Z),
                l._startClamp && (l._startClamp += Z),
                l._endClamp &&
                  !Ne &&
                  ((l._endClamp = j || -0.001), (j = Math.min(j, dt(y, v)))),
                (ne = j - O || ((O -= 0.01) && 0.001)),
                Te && (Re = d.utils.clamp(0, 1, d.utils.normalize(O, j, st))),
                (l._pinPush = U),
                Ie &&
                  Z &&
                  ((Se = {}),
                  (Se[v.a] = "+=" + Z),
                  Ve && (Se[v.p] = "-=" + re()),
                  d.set([Ie, Xe], Se)),
                u && !(yr && l.end >= dt(y, v)))
              )
                ((Se = Qe(u)),
                  (Pi = v === fe),
                  (It = re()),
                  (Ze = parseFloat(ee(v.a)) + U),
                  !te &&
                    j > 1 &&
                    ((ht = (X ? K.scrollingElement || at : y).style),
                    (ht = {
                      style: ht,
                      value: ht["overflow" + v.a.toUpperCase()],
                    }),
                    X &&
                      Qe(F)["overflow" + v.a.toUpperCase()] !== "scroll" &&
                      (ht.style["overflow" + v.a.toUpperCase()] = "scroll")),
                  fr(u, pe, Se),
                  (Zt = $i(u)),
                  (Ce = wt(u, !0)),
                  (or = we && zt(y, Pi ? Be : fe)()),
                  g
                    ? ((se = [g + v.os2, ne + U + he]),
                      (se.t = pe),
                      (ye = g === oe ? rr(u, v) + ne + U : 0),
                      ye &&
                        (se.push(v.d, ye + he),
                        pe.style.flexBasis !== "auto" &&
                          (pe.style.flexBasis = ye + he)),
                      li(se),
                      Ve &&
                        M.forEach(function (di) {
                          di.pin === Ve &&
                            di.vars.pinSpacing !== !1 &&
                            (di._subPinOffset = !0);
                        }),
                      we && re(st))
                    : ((ye = rr(u, v)),
                      ye &&
                        pe.style.flexBasis !== "auto" &&
                        (pe.style.flexBasis = ye + he)),
                  we &&
                    ((ke = {
                      top: Ce.top + (Pi ? It - O : or) + he,
                      left: Ce.left + (Pi ? or : It - O) + he,
                      boxSizing: "border-box",
                      position: "fixed",
                    }),
                    (ke[Vt] = ke["max" + ai] = Math.ceil(Ce.width) + he),
                    (ke[$t] = ke["max" + Rr] = Math.ceil(Ce.height) + he),
                    (ke[Je] =
                      ke[Je + Ei] =
                      ke[Je + Ci] =
                      ke[Je + Mi] =
                      ke[Je + ki] =
                        "0"),
                    (ke[oe] = Se[oe]),
                    (ke[oe + Ei] = Se[oe + Ei]),
                    (ke[oe + Ci] = Se[oe + Ci]),
                    (ke[oe + Mi] = Se[oe + Mi]),
                    (ke[oe + ki] = Se[oe + ki]),
                    (Ot = Fn(Ct, ke, ae)),
                    Ne && re(0)),
                  i
                    ? ((Ar = i._initted),
                      lr(1),
                      i.render(i.duration(), !0, !0),
                      (_t = ee(v.a) - Ze + ne + U),
                      (Et = Math.abs(ne - _t) > 1),
                      we && Et && Ot.splice(Ot.length - 2, 2),
                      i.render(0, !0, !0),
                      Ar || i.invalidate(!0),
                      i.parent || i.totalTime(i.totalTime()),
                      lr(0))
                    : (_t = ne),
                  ht &&
                    (ht.value
                      ? (ht.style["overflow" + v.a.toUpperCase()] = ht.value)
                      : ht.style.removeProperty("overflow-" + v.a)));
              else if (p && re() && !_)
                for (Ce = p.parentNode; Ce && Ce !== F;)
                  (Ce._pinOffset &&
                    ((O -= Ce._pinOffset), (j -= Ce._pinOffset)),
                    (Ce = Ce.parentNode));
              (hi &&
                hi.forEach(function (di) {
                  return di.revert(!1, !0);
                }),
                (l.start = O),
                (l.end = j),
                (De = tt = Ne ? st : re()),
                !_ && !Ne && (De < st && re(st), (l.scroll.rec = 0)),
                l.revert(!1, !0),
                (gt = Me()),
                nt && ((Ke = -1), nt.restart(!0)),
                (Ee = 0),
                i &&
                  ce &&
                  (i._initted || Yt) &&
                  i.progress() !== Yt &&
                  i.progress(Yt || 0, !0).render(i.time(), !0, !0),
                (Te || Re !== l.progress || _ || I) &&
                  (i &&
                    !ce &&
                    i.totalProgress(
                      _ && O < -0.001 && !Re ? d.utils.normalize(O, j, 0) : Re,
                      !0,
                    ),
                  (l.progress = Te || (De - O) / ne === Re ? 0 : Re)),
                u && g && (pe._pinOffset = Math.round(l.progress * _t)),
                L && L.invalidate(),
                isNaN(fi) ||
                  ((fi -= d.getProperty(c, v.p)),
                  (zi -= d.getProperty(Fe, v.p)),
                  Ui(c, v, fi),
                  Ui(Ie, v, fi - (x || 0)),
                  Ui(Fe, v, zi),
                  Ui(Xe, v, zi - (x || 0))),
                Te && !Ne && l.update(),
                R && !Ne && !Tt && ((Tt = !0), R(l), (Tt = !1)));
            }
          }),
          (l.getVelocity = function () {
            return ((re() - tt) / (Me() - mi)) * 1e3 || 0;
          }),
          (l.endAnimation = function () {
            (gi(l.callbackAnimation),
              i &&
                (L
                  ? L.progress(1)
                  : i.paused()
                    ? ce || gi(i, l.direction < 0, 1)
                    : gi(i, i.reversed())));
          }),
          (l.labelToScroll = function (f) {
            return (
              (i &&
                i.labels &&
                (O || l.refresh() || O) + (i.labels[f] / i.duration()) * ne) ||
              0
            );
          }),
          (l.getTrailing = function (f) {
            var C = M.indexOf(l),
              S = l.direction > 0 ? M.slice(0, C).reverse() : M.slice(C + 1);
            return (
              qe(f)
                ? S.filter(function (x) {
                    return x.vars.preventOverlaps === f;
                  })
                : S
            ).filter(function (x) {
              return l.direction > 0 ? x.end <= O : x.start >= j;
            });
          }),
          (l.update = function (f, C, S) {
            if (!(_ && !S && !f)) {
              var x = Ne === !0 ? st : l.scroll(),
                ge = f ? 0 : (x - O) / ne,
                P = ge < 0 ? 0 : ge > 1 ? 1 : ge || 0,
                te = l.progress,
                Te,
                Z,
                U,
                H,
                ot,
                G,
                Ve,
                ct;
              if (
                (C &&
                  ((tt = De),
                  (De = _ ? re() : x),
                  w && ((Nt = Mt), (Mt = i && !ce ? i.totalProgress() : P))),
                Y &&
                  u &&
                  !Ee &&
                  !Ii &&
                  je &&
                  (!P && O < x + ((x - tt) / (Me() - mi)) * Y
                    ? (P = 1e-4)
                    : P === 1 &&
                      j > x + ((x - tt) / (Me() - mi)) * Y &&
                      (P = 0.9999)),
                P !== te && l.enabled)
              ) {
                if (
                  ((Te = l.isActive = !!P && P < 1),
                  (Z = !!te && te < 1),
                  (G = Te !== Z),
                  (ot = G || !!P != !!te),
                  (l.direction = P > te ? 1 : -1),
                  (l.progress = P),
                  ot &&
                    !Ee &&
                    ((U = P && !te ? 0 : P === 1 ? 1 : te === 1 ? 2 : 3),
                    ce &&
                      ((H = (!G && E[U + 1] !== "none" && E[U + 1]) || E[U]),
                      (ct =
                        i && (H === "complete" || H === "reset" || H in i)))),
                  ve &&
                    (G || ct) &&
                    (ct || k || !i) &&
                    (Ye(ve)
                      ? ve(l)
                      : l.getTrailing(ve).forEach(function (It) {
                          return It.endAnimation();
                        })),
                  ce ||
                    (L && !Ee && !Ii
                      ? (L._dp._time - L._start !== L._time &&
                          L.render(L._dp._time - L._start),
                        L.resetTo
                          ? L.resetTo("totalProgress", P, i._tTime / i._tDur)
                          : ((L.vars.totalProgress = P),
                            L.invalidate().restart()))
                      : i && i.totalProgress(P, !!(Ee && (gt || f)))),
                  u)
                ) {
                  if ((f && g && (pe.style[g + v.os2] = ci), !we))
                    it(vi(Ze + _t * P));
                  else if (ot) {
                    if (
                      ((Ve = !f && P > te && j + 1 > x && x + 1 >= dt(y, v)),
                      ae)
                    )
                      if (!f && (Te || Ve)) {
                        var ye = wt(u, !0),
                          Se = x - O;
                        qr(
                          u,
                          F,
                          ye.top + (v === fe ? Se : 0) + he,
                          ye.left + (v === fe ? 0 : Se) + he,
                        );
                      } else qr(u, pe);
                    (li(Te || Ve ? Ot : Zt),
                      (Et && P < 1 && Te) ||
                        it(Ze + (P === 1 && !Ve ? _t : 0)));
                  }
                }
                (w && !Le.tween && !Ee && !Ii && nt.restart(!0),
                  o &&
                    (G || (le && P && (P < 1 || !ar))) &&
                    Li(o.targets).forEach(function (It) {
                      return It.classList[Te || le ? "add" : "remove"](
                        o.className,
                      );
                    }),
                  a && !ce && !f && a(l),
                  ot && !Ee
                    ? (ce &&
                        (ct &&
                          (H === "complete"
                            ? i.pause().totalProgress(1)
                            : H === "reset"
                              ? i.restart(!0).pause()
                              : H === "restart"
                                ? i.restart(!0)
                                : i[H]()),
                        a && a(l)),
                      (G || !ar) &&
                        (m && G && ur(l, m),
                        de[U] && ur(l, de[U]),
                        le && (P === 1 ? l.kill(!1, 1) : (de[U] = 0)),
                        G || ((U = P === 1 ? 1 : 3), de[U] && ur(l, de[U]))),
                      Q &&
                        !Te &&
                        Math.abs(l.getVelocity()) > (wi(Q) ? Q : 2500) &&
                        (gi(l.callbackAnimation),
                        L ? L.progress(1) : gi(i, H === "reverse" ? 1 : !P, 1)))
                    : ce && a && !Ee && a(l));
              }
              if (Jt) {
                var Ce = _ ? (x / _.duration()) * (_._caScrollDist || 0) : x;
                (Ai(Ce + (c._isFlipped ? 1 : 0)), Jt(Ce));
              }
              jt && jt((-x / _.duration()) * (_._caScrollDist || 0));
            }
          }),
          (l.enable = function (f, C) {
            l.enabled ||
              ((l.enabled = !0),
              _e(y, "resize", yi),
              X || _e(y, "scroll", ti),
              q && _e(s, "refreshInit", q),
              f !== !1 && ((l.progress = Re = 0), (De = tt = Ke = re())),
              C !== !1 && l.refresh());
          }),
          (l.getTween = function (f) {
            return f && Le ? Le.tween : L;
          }),
          (l.setPositions = function (f, C, S, x) {
            if (_) {
              var ge = _.scrollTrigger,
                P = _.duration(),
                te = ge.end - ge.start;
              ((f = ge.start + (te * f) / P), (C = ge.start + (te * C) / P));
            }
            (l.refresh(
              !1,
              !1,
              {
                start: Yr(f, S && !!l._startClamp),
                end: Yr(C, S && !!l._endClamp),
              },
              x,
            ),
              l.update());
          }),
          (l.adjustPinSpacing = function (f) {
            if (se && f) {
              var C = se.indexOf(v.d) + 1;
              ((se[C] = parseFloat(se[C]) + f + he),
                (se[1] = parseFloat(se[1]) + f + he),
                li(se));
            }
          }),
          (l.disable = function (f, C) {
            if (
              l.enabled &&
              (f !== !1 && l.revert(!0, !0),
              (l.enabled = l.isActive = !1),
              C || (L && L.pause()),
              (st = 0),
              xe && (xe.uncache = 1),
              q && me(s, "refreshInit", q),
              nt && (nt.pause(), Le.tween && Le.tween.kill() && (Le.tween = 0)),
              !X)
            ) {
              for (var S = M.length; S--;)
                if (M[S].scroller === y && M[S] !== l) return;
              (me(y, "resize", yi), X || me(y, "scroll", ti));
            }
          }),
          (l.kill = function (f, C) {
            (l.disable(f, C), L && !C && L.kill(), h && delete Sr[h]);
            var S = M.indexOf(l);
            (S >= 0 && M.splice(S, 1),
              S === Oe && Ji > 0 && Oe--,
              (S = 0),
              M.forEach(function (x) {
                return x.scroller === l.scroller && (S = 1);
              }),
              S || Ne || (l.scroll.rec = 0),
              i &&
                ((i.scrollTrigger = null),
                f && i.revert({ kill: !1 }),
                C || i.kill()),
              Ie &&
                [Ie, Xe, c, Fe].forEach(function (x) {
                  return x.parentNode && x.parentNode.removeChild(x);
                }),
              Ri === l && (Ri = 0),
              u &&
                (xe && (xe.uncache = 1),
                (S = 0),
                M.forEach(function (x) {
                  return x.pin === u && S++;
                }),
                S || (xe.spacer = 0)),
              t.onKill && t.onKill(l));
          }),
          M.push(l),
          l.enable(!1, !1),
          vt && vt(l),
          i && i.add && !ne)
        ) {
          var B = l.update;
          ((l.update = function () {
            ((l.update = B), O || j || l.refresh());
          }),
            d.delayedCall(0.01, l.update),
            (ne = 0.01),
            (O = j = 0));
        } else l.refresh();
        u && Hn();
      }),
      (s.register = function (t) {
        return (
          ii ||
            ((d = t || pn()), dn() && window.document && s.enable(), (ii = _i)),
          ii
        );
      }),
      (s.defaults = function (t) {
        if (t) for (var i in t) Fi[i] = t[i];
        return Fi;
      }),
      (s.disable = function (t, i) {
        ((_i = 0),
          M.forEach(function (a) {
            return a[i ? "kill" : "disable"](t);
          }),
          me(z, "wheel", ti),
          me(K, "scroll", ti),
          clearInterval(Yi),
          me(K, "touchcancel", ft),
          me(F, "touchstart", ft),
          Wi(me, K, "pointerdown,touchstart,mousedown", Ir),
          Wi(me, K, "pointerup,touchend,mouseup", Hr),
          tr.kill(),
          Hi(me));
        for (var n = 0; n < D.length; n += 3)
          (Xi(me, D[n], D[n + 1]), Xi(me, D[n], D[n + 2]));
      }),
      (s.enable = function () {
        if (
          ((z = window),
          (K = document),
          (at = K.documentElement),
          (F = K.body),
          d &&
            ((Li = d.utils.toArray),
            (Ti = d.utils.clamp),
            (wr = d.core.context || ft),
            (lr = d.core.suppressOverwrites || ft),
            (Cr = z.history.scrollRestoration || "auto"),
            (br = z.pageYOffset),
            d.core.globals("ScrollTrigger", s),
            F))
        ) {
          ((_i = 1),
            (oi = document.createElement("div")),
            (oi.style.height = "100vh"),
            (oi.style.position = "absolute"),
            xn(),
            Pn(),
            ie.register(d),
            (s.isTouch = ie.isTouch),
            (Lt =
              ie.isTouch &&
              /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent)),
            (vr = ie.isTouch === 1),
            _e(z, "wheel", ti),
            (an = [z, K, at, F]),
            d.matchMedia
              ? ((s.matchMedia = function (h) {
                  var m = d.matchMedia(),
                    R;
                  for (R in h) m.add(R, h[R]);
                  return m;
                }),
                d.addEventListener("matchMediaInit", function () {
                  return Dr();
                }),
                d.addEventListener("matchMediaRevert", function () {
                  return Sn();
                }),
                d.addEventListener("matchMedia", function () {
                  (Ft(0, 1), Kt("matchMedia"));
                }),
                d.matchMedia("(orientation: portrait)", function () {
                  return (hr(), hr);
                }))
              : console.warn("Requires GSAP 3.11.0 or later"),
            hr(),
            _e(K, "scroll", ti));
          var t = F.style,
            i = t.borderTopStyle,
            n = d.core.Animation.prototype,
            a,
            o;
          for (
            n.revert ||
              Object.defineProperty(n, "revert", {
                value: function () {
                  return this.time(-0.01, !0);
                },
              }),
              t.borderTopStyle = "solid",
              a = wt(F),
              fe.m = Math.round(a.top + fe.sc()) || 0,
              Be.m = Math.round(a.left + Be.sc()) || 0,
              i ? (t.borderTopStyle = i) : t.removeProperty("border-top-style"),
              Yi = setInterval(Fr, 250),
              d.delayedCall(0.5, function () {
                return (Ii = 0);
              }),
              _e(K, "touchcancel", ft),
              _e(F, "touchstart", ft),
              Wi(_e, K, "pointerdown,touchstart,mousedown", Ir),
              Wi(_e, K, "pointerup,touchend,mouseup", Hr),
              _r = d.utils.checkPrefix("transform"),
              Qi.push(_r),
              ii = Me(),
              tr = d.delayedCall(0.2, Ft).pause(),
              ri = [
                K,
                "visibilitychange",
                function () {
                  var h = z.innerWidth,
                    m = z.innerHeight;
                  K.hidden
                    ? ((Or = h), (Nr = m))
                    : (Or !== h || Nr !== m) && yi();
                },
                K,
                "DOMContentLoaded",
                Ft,
                z,
                "load",
                Ft,
                z,
                "resize",
                yi,
              ],
              Hi(_e),
              M.forEach(function (h) {
                return h.enable(0, 1);
              }),
              o = 0;
            o < D.length;
            o += 3
          )
            (Xi(me, D[o], D[o + 1]), Xi(me, D[o], D[o + 2]));
        }
      }),
      (s.config = function (t) {
        "limitCallbacks" in t && (ar = !!t.limitCallbacks);
        var i = t.syncInterval;
        ((i && clearInterval(Yi)) || ((Yi = i) && setInterval(Fr, i)),
          "ignoreMobileResize" in t &&
            (vr = s.isTouch === 1 && t.ignoreMobileResize),
          "autoRefreshEvents" in t &&
            (Hi(me) || Hi(_e, t.autoRefreshEvents || "none"),
            (un = (t.autoRefreshEvents + "").indexOf("resize") === -1)));
      }),
      (s.scrollerProxy = function (t, i) {
        var n = He(t),
          a = D.indexOf(n),
          o = qt(n);
        (~a && D.splice(a, o ? 6 : 2),
          i && (o ? pt.unshift(z, i, F, i, at, i) : pt.unshift(n, i)));
      }),
      (s.clearMatchMedia = function (t) {
        M.forEach(function (i) {
          return i._ctx && i._ctx.query === t && i._ctx.kill(!0, !0);
        });
      }),
      (s.isInViewport = function (t, i, n) {
        var a = (qe(t) ? He(t) : t).getBoundingClientRect(),
          o = a[n ? Vt : $t] * i || 0;
        return n
          ? a.right - o > 0 && a.left + o < z.innerWidth
          : a.bottom - o > 0 && a.top + o < z.innerHeight;
      }),
      (s.positionInViewport = function (t, i, n) {
        qe(t) && (t = He(t));
        var a = t.getBoundingClientRect(),
          o = a[n ? Vt : $t],
          h =
            i == null
              ? o / 2
              : i in nr
                ? nr[i] * o
                : ~i.indexOf("%")
                  ? (parseFloat(i) * o) / 100
                  : parseFloat(i) || 0;
        return n ? (a.left + h) / z.innerWidth : (a.top + h) / z.innerHeight;
      }),
      (s.killAll = function (t) {
        if (
          (M.slice(0).forEach(function (n) {
            return n.vars.id !== "ScrollSmoother" && n.kill();
          }),
          t !== !0)
        ) {
          var i = Gt.killAll || [];
          ((Gt = {}),
            i.forEach(function (n) {
              return n();
            }));
        }
      }),
      s
    );
  })();
A.version = "3.12.5";
A.saveStyles = function (s) {
  return s
    ? Li(s).forEach(function (e) {
        if (e && e.style) {
          var r = Ue.indexOf(e);
          (r >= 0 && Ue.splice(r, 5),
            Ue.push(
              e,
              e.style.cssText,
              e.getBBox && e.getAttribute("transform"),
              d.core.getCache(e),
              wr(),
            ));
        }
      })
    : Ue;
};
A.revert = function (s, e) {
  return Dr(!s, e);
};
A.create = function (s, e) {
  return new A(s, e);
};
A.refresh = function (s) {
  return s ? yi() : (ii || A.register()) && Ft(!0);
};
A.update = function (s) {
  return ++D.cache && St(s === !0 ? 2 : 0);
};
A.clearScrollMemory = bn;
A.maxScroll = function (s, e) {
  return dt(s, e ? Be : fe);
};
A.getScrollFunc = function (s, e) {
  return zt(He(s), e ? Be : fe);
};
A.getById = function (s) {
  return Sr[s];
};
A.getAll = function () {
  return M.filter(function (s) {
    return s.vars.id !== "ScrollSmoother";
  });
};
A.isScrolling = function () {
  return !!je;
};
A.snapDirectional = Lr;
A.addEventListener = function (s, e) {
  var r = Gt[s] || (Gt[s] = []);
  ~r.indexOf(e) || r.push(e);
};
A.removeEventListener = function (s, e) {
  var r = Gt[s],
    t = r && r.indexOf(e);
  t >= 0 && r.splice(t, 1);
};
A.batch = function (s, e) {
  var r = [],
    t = {},
    i = e.interval || 0.016,
    n = e.batchMax || 1e9,
    a = function (m, R) {
      var k = [],
        p = [],
        u = d
          .delayedCall(i, function () {
            (R(k, p), (k = []), (p = []));
          })
          .pause();
      return function (g) {
        (k.length || u.restart(!0),
          k.push(g.trigger),
          p.push(g),
          n <= k.length && u.progress(1));
      };
    },
    o;
  for (o in e)
    t[o] =
      o.substr(0, 2) === "on" && Ye(e[o]) && o !== "onRefreshInit"
        ? a(o, e[o])
        : e[o];
  return (
    Ye(n) &&
      ((n = n()),
      _e(A, "refresh", function () {
        return (n = e.batchMax());
      })),
    Li(s).forEach(function (h) {
      var m = {};
      for (o in t) m[o] = t[o];
      ((m.trigger = h), r.push(A.create(m)));
    }),
    r
  );
};
var Kr = function (e, r, t, i) {
    return (
      r > i ? e(i) : r < 0 && e(0),
      t > i ? (i - r) / (t - r) : t < 0 ? r / (r - t) : 1
    );
  },
  dr = function s(e, r) {
    (r === !0
      ? e.style.removeProperty("touch-action")
      : (e.style.touchAction =
          r === !0
            ? "auto"
            : r
              ? "pan-" + r + (ie.isTouch ? " pinch-zoom" : "")
              : "none"),
      e === at && s(F, r));
  },
  qi = { auto: 1, scroll: 1 },
  $n = function (e) {
    var r = e.event,
      t = e.target,
      i = e.axis,
      n = (r.changedTouches ? r.changedTouches[0] : r).target,
      a = n._gsap || d.core.getCache(n),
      o = Me(),
      h;
    if (!a._isScrollT || o - a._isScrollT > 2e3) {
      for (
        ;
        n &&
        n !== F &&
        ((n.scrollHeight <= n.clientHeight && n.scrollWidth <= n.clientWidth) ||
          !(qi[(h = Qe(n)).overflowY] || qi[h.overflowX]));
      )
        n = n.parentNode;
      ((a._isScroll =
        n &&
        n !== t &&
        !qt(n) &&
        (qi[(h = Qe(n)).overflowY] || qi[h.overflowX])),
        (a._isScrollT = o));
    }
    (a._isScroll || i === "x") && (r.stopPropagation(), (r._gsapAllow = !0));
  },
  Cn = function (e, r, t, i) {
    return ie.create({
      target: e,
      capture: !0,
      debounce: !1,
      lockAxis: !0,
      type: r,
      onWheel: (i = i && $n),
      onPress: i,
      onDrag: i,
      onScroll: i,
      onEnable: function () {
        return t && _e(K, ie.eventTypes[0], Jr, !1, !0);
      },
      onDisable: function () {
        return me(K, ie.eventTypes[0], Jr, !0);
      },
    });
  },
  Un = /(input|label|select|textarea)/i,
  Zr,
  Jr = function (e) {
    var r = Un.test(e.target.tagName);
    (r || Zr) && ((e._gsapAllow = !0), (Zr = r));
  },
  qn = function (e) {
    (Wt(e) || (e = {}),
      (e.preventDefault = e.isNormalizer = e.allowClicks = !0),
      e.type || (e.type = "wheel,touch"),
      (e.debounce = !!e.debounce),
      (e.id = e.id || "normalizer"));
    var r = e,
      t = r.normalizeScrollX,
      i = r.momentum,
      n = r.allowNestedScroll,
      a = r.onRelease,
      o,
      h,
      m = He(e.target) || at,
      R = d.core.globals().ScrollSmoother,
      k = R && R.get(),
      p =
        Lt &&
        ((e.content && He(e.content)) ||
          (k && e.content !== !1 && !k.smooth() && k.content())),
      u = zt(m, fe),
      g = zt(m, Be),
      I = 1,
      Y =
        (ie.isTouch && z.visualViewport
          ? z.visualViewport.scale * z.visualViewport.width
          : z.outerWidth) / z.innerWidth,
      J = 0,
      W = Ye(i)
        ? function () {
            return i(o);
          }
        : function () {
            return i || 2.8;
          },
      le,
      w,
      ae = Cn(m, e.type, !0, n),
      N = function () {
        return (w = !1);
      },
      _ = ft,
      Q = ft,
      ve = function () {
        ((h = dt(m, fe)),
          (Q = Ti(Lt ? 1 : 0, h)),
          t && (_ = Ti(0, dt(m, Be))),
          (le = Ut));
      },
      v = function () {
        ((p._gsap.y = vi(parseFloat(p._gsap.y) + u.offset) + "px"),
          (p.style.transform =
            "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " +
            parseFloat(p._gsap.y) +
            ", 0, 1)"),
          (u.offset = u.cacheID = 0));
      },
      ce = function () {
        if (w) {
          requestAnimationFrame(N);
          var V = vi(o.deltaY / 2),
            $ = Q(u.v - V);
          if (p && $ !== u.v + u.offset) {
            u.offset = $ - u.v;
            var l = vi((parseFloat(p && p._gsap.y) || 0) - u.offset);
            ((p.style.transform =
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " +
              l +
              ", 0, 1)"),
              (p._gsap.y = l + "px"),
              (u.cacheID = D.cache),
              St());
          }
          return !0;
        }
        (u.offset && v(), (w = !0));
      },
      y,
      We,
      X,
      we,
      de = function () {
        (ve(),
          y.isActive() &&
            y.vars.scrollY > h &&
            (u() > h ? y.progress(1) && u(h) : y.resetTo("scrollY", h)));
      };
    return (
      p && d.set(p, { y: "+=0" }),
      (e.ignoreCheck = function (E) {
        return (
          (Lt && E.type === "touchmove" && ce()) ||
          (I > 1.05 && E.type !== "touchstart") ||
          o.isGesturing ||
          (E.touches && E.touches.length > 1)
        );
      }),
      (e.onPress = function () {
        w = !1;
        var E = I;
        ((I = vi(((z.visualViewport && z.visualViewport.scale) || 1) / Y)),
          y.pause(),
          E !== I && dr(m, I > 1.01 ? !0 : t ? !1 : "x"),
          (We = g()),
          (X = u()),
          ve(),
          (le = Ut));
      }),
      (e.onRelease = e.onGestureStart =
        function (E, V) {
          if ((u.offset && v(), !V)) we.restart(!0);
          else {
            D.cache++;
            var $ = W(),
              l,
              q;
            (t &&
              ((l = g()),
              (q = l + ($ * 0.05 * -E.velocityX) / 0.227),
              ($ *= Kr(g, l, q, dt(m, Be))),
              (y.vars.scrollX = _(q))),
              (l = u()),
              (q = l + ($ * 0.05 * -E.velocityY) / 0.227),
              ($ *= Kr(u, l, q, dt(m, fe))),
              (y.vars.scrollY = Q(q)),
              y.invalidate().duration($).play(0.01),
              ((Lt && y.vars.scrollY >= h) || l >= h - 1) &&
                d.to({}, { onUpdate: de, duration: $ }));
          }
          a && a(E);
        }),
      (e.onWheel = function () {
        (y._ts && y.pause(), Me() - J > 1e3 && ((le = 0), (J = Me())));
      }),
      (e.onChange = function (E, V, $, l, q) {
        if (
          (Ut !== le && ve(),
          V && t && g(_(l[2] === V ? We + (E.startX - E.x) : g() + V - l[1])),
          $)
        ) {
          u.offset && v();
          var et = q[2] === $,
            bt = et ? X + E.startY - E.y : u() + $ - q[1],
            Ke = Q(bt);
          (et && bt !== Ke && (X += Ke - bt), u(Ke));
        }
        ($ || V) && St();
      }),
      (e.onEnable = function () {
        (dr(m, t ? !1 : "x"),
          A.addEventListener("refresh", de),
          _e(z, "resize", de),
          u.smooth &&
            ((u.target.style.scrollBehavior = "auto"),
            (u.smooth = g.smooth = !1)),
          ae.enable());
      }),
      (e.onDisable = function () {
        (dr(m, !0),
          me(z, "resize", de),
          A.removeEventListener("refresh", de),
          ae.kill());
      }),
      (e.lockAxis = e.lockAxis !== !1),
      (o = new ie(e)),
      (o.iOS = Lt),
      Lt && !u() && u(1),
      Lt && d.ticker.add(ft),
      (we = o._dc),
      (y = d.to(o, {
        ease: "power4",
        paused: !0,
        inherit: !1,
        scrollX: t ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
          scrollY: Tn(u, u(), function () {
            return y.pause();
          }),
        },
        onUpdate: St,
        onComplete: we.vars.onComplete,
      })),
      o
    );
  };
A.sort = function (s) {
  return M.sort(
    s ||
      function (e, r) {
        return (
          (e.vars.refreshPriority || 0) * -1e6 +
          e.start -
          (r.start + (r.vars.refreshPriority || 0) * -1e6)
        );
      },
  );
};
A.observe = function (s) {
  return new ie(s);
};
A.normalizeScroll = function (s) {
  if (typeof s > "u") return ze;
  if (s === !0 && ze) return ze.enable();
  if (s === !1) {
    (ze && ze.kill(), (ze = s));
    return;
  }
  var e = s instanceof ie ? s : qn(s);
  return (
    ze && ze.target === e.target && ze.kill(),
    qt(e.target) && (ze = e),
    e
  );
};
A.core = {
  _getVelocityProp: mr,
  _inputObserver: Cn,
  _scrollers: D,
  _proxies: pt,
  bridge: {
    ss: function () {
      (je || Kt("scrollStart"), (je = Me()));
    },
    ref: function () {
      return Ee;
    },
  },
};
pn() && d.registerPlugin(A);
function kn(s, e, r) {
  return Math.max(s, Math.min(e, r));
}
class Gn {
  constructor() {
    ((this.isRunning = !1),
      (this.value = 0),
      (this.from = 0),
      (this.to = 0),
      (this.currentTime = 0));
  }
  advance(e) {
    var r;
    if (!this.isRunning) return;
    let t = !1;
    if (this.duration && this.easing) {
      this.currentTime += e;
      const i = kn(0, this.currentTime / this.duration, 1);
      t = i >= 1;
      const n = t ? 1 : this.easing(i);
      this.value = this.from + (this.to - this.from) * n;
    } else
      this.lerp
        ? ((this.value = (function (n, a, o, h) {
            return (function (R, k, p) {
              return (1 - p) * R + p * k;
            })(n, a, 1 - Math.exp(-o * h));
          })(this.value, this.to, 60 * this.lerp, e)),
          Math.round(this.value) === this.to &&
            ((this.value = this.to), (t = !0)))
        : ((this.value = this.to), (t = !0));
    (t && this.stop(),
      (r = this.onUpdate) === null ||
        r === void 0 ||
        r.call(this, this.value, t));
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(e, r, { lerp: t, duration: i, easing: n, onStart: a, onUpdate: o }) {
    ((this.from = this.value = e),
      (this.to = r),
      (this.lerp = t),
      (this.duration = i),
      (this.easing = n),
      (this.currentTime = 0),
      (this.isRunning = !0),
      a?.(),
      (this.onUpdate = o));
  }
}
class Kn {
  constructor(e, r, { autoResize: t = !0, debounce: i = 250 } = {}) {
    ((this.wrapper = e),
      (this.content = r),
      (this.width = 0),
      (this.height = 0),
      (this.scrollHeight = 0),
      (this.scrollWidth = 0),
      (this.resize = () => {
        (this.onWrapperResize(), this.onContentResize());
      }),
      (this.onWrapperResize = () => {
        this.wrapper instanceof Window
          ? ((this.width = window.innerWidth),
            (this.height = window.innerHeight))
          : ((this.width = this.wrapper.clientWidth),
            (this.height = this.wrapper.clientHeight));
      }),
      (this.onContentResize = () => {
        this.wrapper instanceof Window
          ? ((this.scrollHeight = this.content.scrollHeight),
            (this.scrollWidth = this.content.scrollWidth))
          : ((this.scrollHeight = this.wrapper.scrollHeight),
            (this.scrollWidth = this.wrapper.scrollWidth));
      }),
      t &&
        ((this.debouncedResize = (function (a, o) {
          let h;
          return function (...m) {
            let R = this;
            (clearTimeout(h),
              (h = setTimeout(() => {
                ((h = void 0), a.apply(R, m));
              }, o)));
          };
        })(this.resize, i)),
        this.wrapper instanceof Window
          ? window.addEventListener("resize", this.debouncedResize, !1)
          : ((this.wrapperResizeObserver = new ResizeObserver(
              this.debouncedResize,
            )),
            this.wrapperResizeObserver.observe(this.wrapper)),
        (this.contentResizeObserver = new ResizeObserver(this.debouncedResize)),
        this.contentResizeObserver.observe(this.content)),
      this.resize());
  }
  destroy() {
    var e, r;
    ((e = this.wrapperResizeObserver) === null ||
      e === void 0 ||
      e.disconnect(),
      (r = this.contentResizeObserver) === null ||
        r === void 0 ||
        r.disconnect(),
      this.wrapper === window &&
        this.debouncedResize &&
        window.removeEventListener("resize", this.debouncedResize, !1));
  }
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height,
    };
  }
}
class En {
  constructor() {
    this.events = {};
  }
  emit(e, ...r) {
    var t;
    let i = this.events[e] || [];
    for (let n = 0, a = i.length; n < a; n++)
      (t = i[n]) === null || t === void 0 || t.call(i, ...r);
  }
  on(e, r) {
    var t;
    return (
      (!((t = this.events[e]) === null || t === void 0) && t.push(r)) ||
        (this.events[e] = [r]),
      () => {
        var i;
        this.events[e] =
          (i = this.events[e]) === null || i === void 0
            ? void 0
            : i.filter((n) => r !== n);
      }
    );
  }
  off(e, r) {
    var t;
    this.events[e] =
      (t = this.events[e]) === null || t === void 0
        ? void 0
        : t.filter((i) => r !== i);
  }
  destroy() {
    this.events = {};
  }
}
const Qr = 100 / 6,
  Rt = { passive: !1 };
class Zn {
  constructor(e, r = { wheelMultiplier: 1, touchMultiplier: 1 }) {
    ((this.element = e),
      (this.options = r),
      (this.touchStart = { x: 0, y: 0 }),
      (this.lastDelta = { x: 0, y: 0 }),
      (this.window = { width: 0, height: 0 }),
      (this.emitter = new En()),
      (this.onTouchStart = (t) => {
        const { clientX: i, clientY: n } = t.targetTouches
          ? t.targetTouches[0]
          : t;
        ((this.touchStart.x = i),
          (this.touchStart.y = n),
          (this.lastDelta = { x: 0, y: 0 }),
          this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t }));
      }),
      (this.onTouchMove = (t) => {
        const { clientX: i, clientY: n } = t.targetTouches
            ? t.targetTouches[0]
            : t,
          a = -(i - this.touchStart.x) * this.options.touchMultiplier,
          o = -(n - this.touchStart.y) * this.options.touchMultiplier;
        ((this.touchStart.x = i),
          (this.touchStart.y = n),
          (this.lastDelta = { x: a, y: o }),
          this.emitter.emit("scroll", { deltaX: a, deltaY: o, event: t }));
      }),
      (this.onTouchEnd = (t) => {
        this.emitter.emit("scroll", {
          deltaX: this.lastDelta.x,
          deltaY: this.lastDelta.y,
          event: t,
        });
      }),
      (this.onWheel = (t) => {
        let { deltaX: i, deltaY: n, deltaMode: a } = t;
        ((i *= a === 1 ? Qr : a === 2 ? this.window.width : 1),
          (n *= a === 1 ? Qr : a === 2 ? this.window.height : 1),
          (i *= this.options.wheelMultiplier),
          (n *= this.options.wheelMultiplier),
          this.emitter.emit("scroll", { deltaX: i, deltaY: n, event: t }));
      }),
      (this.onWindowResize = () => {
        this.window = { width: window.innerWidth, height: window.innerHeight };
      }),
      window.addEventListener("resize", this.onWindowResize, !1),
      this.onWindowResize(),
      this.element.addEventListener("wheel", this.onWheel, Rt),
      this.element.addEventListener("touchstart", this.onTouchStart, Rt),
      this.element.addEventListener("touchmove", this.onTouchMove, Rt),
      this.element.addEventListener("touchend", this.onTouchEnd, Rt));
  }
  on(e, r) {
    return this.emitter.on(e, r);
  }
  destroy() {
    (this.emitter.destroy(),
      window.removeEventListener("resize", this.onWindowResize, !1),
      this.element.removeEventListener("wheel", this.onWheel, Rt),
      this.element.removeEventListener("touchstart", this.onTouchStart, Rt),
      this.element.removeEventListener("touchmove", this.onTouchMove, Rt),
      this.element.removeEventListener("touchend", this.onTouchEnd, Rt));
  }
}
class Jn {
  constructor({
    wrapper: e = window,
    content: r = document.documentElement,
    eventsTarget: t = e,
    smoothWheel: i = !0,
    syncTouch: n = !1,
    syncTouchLerp: a = 0.075,
    touchInertiaMultiplier: o = 35,
    duration: h,
    easing: m = (w) => Math.min(1, 1.001 - Math.pow(2, -10 * w)),
    lerp: R = 0.1,
    infinite: k = !1,
    orientation: p = "vertical",
    gestureOrientation: u = "vertical",
    touchMultiplier: g = 1,
    wheelMultiplier: I = 1,
    autoResize: Y = !0,
    prevent: J,
    virtualScroll: W,
    __experimental__naiveDimensions: le = !1,
  } = {}) {
    ((this._isScrolling = !1),
      (this._isStopped = !1),
      (this._isLocked = !1),
      (this._preventNextNativeScrollEvent = !1),
      (this._resetVelocityTimeout = null),
      (this.time = 0),
      (this.userData = {}),
      (this.lastVelocity = 0),
      (this.velocity = 0),
      (this.direction = 0),
      (this.animate = new Gn()),
      (this.emitter = new En()),
      (this.onPointerDown = (w) => {
        w.button === 1 && this.reset();
      }),
      (this.onVirtualScroll = (w) => {
        if (
          typeof this.options.virtualScroll == "function" &&
          this.options.virtualScroll(w) === !1
        )
          return;
        const { deltaX: ae, deltaY: N, event: _ } = w;
        if (
          (this.emitter.emit("virtual-scroll", {
            deltaX: ae,
            deltaY: N,
            event: _,
          }),
          _.ctrlKey)
        )
          return;
        const Q = _.type.includes("touch"),
          ve = _.type.includes("wheel");
        if (
          ((this.isTouching =
            _.type === "touchstart" || _.type === "touchmove"),
          this.options.syncTouch &&
            Q &&
            _.type === "touchstart" &&
            !this.isStopped &&
            !this.isLocked)
        )
          return void this.reset();
        const v = ae === 0 && N === 0,
          ce =
            (this.options.gestureOrientation === "vertical" && N === 0) ||
            (this.options.gestureOrientation === "horizontal" && ae === 0);
        if (v || ce) return;
        let y = _.composedPath();
        y = y.slice(0, y.indexOf(this.rootElement));
        const We = this.options.prevent;
        if (
          y.find((E) => {
            var V, $, l, q, et;
            return (
              E instanceof HTMLElement &&
              ((typeof We == "function" && We?.(E)) ||
                ((V = E.hasAttribute) === null || V === void 0
                  ? void 0
                  : V.call(E, "data-lenis-prevent")) ||
                (Q &&
                  (($ = E.hasAttribute) === null || $ === void 0
                    ? void 0
                    : $.call(E, "data-lenis-prevent-touch"))) ||
                (ve &&
                  ((l = E.hasAttribute) === null || l === void 0
                    ? void 0
                    : l.call(E, "data-lenis-prevent-wheel"))) ||
                (((q = E.classList) === null || q === void 0
                  ? void 0
                  : q.contains("lenis")) &&
                  !(
                    !((et = E.classList) === null || et === void 0) &&
                    et.contains("lenis-stopped")
                  )))
            );
          })
        )
          return;
        if (this.isStopped || this.isLocked) return void _.preventDefault();
        if (!(
          (this.options.syncTouch && Q) ||
          (this.options.smoothWheel && ve)
        ))
          return ((this.isScrolling = "native"), void this.animate.stop());
        _.preventDefault();
        let X = N;
        this.options.gestureOrientation === "both"
          ? (X = Math.abs(N) > Math.abs(ae) ? N : ae)
          : this.options.gestureOrientation === "horizontal" && (X = ae);
        const we = Q && this.options.syncTouch,
          de = Q && _.type === "touchend" && Math.abs(X) > 5;
        (de && (X = this.velocity * this.options.touchInertiaMultiplier),
          this.scrollTo(
            this.targetScroll + X,
            Object.assign(
              { programmatic: !1 },
              we
                ? { lerp: de ? this.options.syncTouchLerp : 1 }
                : {
                    lerp: this.options.lerp,
                    duration: this.options.duration,
                    easing: this.options.easing,
                  },
            ),
          ));
      }),
      (this.onNativeScroll = () => {
        if (
          (this._resetVelocityTimeout !== null &&
            (clearTimeout(this._resetVelocityTimeout),
            (this._resetVelocityTimeout = null)),
          this._preventNextNativeScrollEvent)
        )
          this._preventNextNativeScrollEvent = !1;
        else if (this.isScrolling === !1 || this.isScrolling === "native") {
          const w = this.animatedScroll;
          ((this.animatedScroll = this.targetScroll = this.actualScroll),
            (this.lastVelocity = this.velocity),
            (this.velocity = this.animatedScroll - w),
            (this.direction = Math.sign(this.animatedScroll - w)),
            (this.isScrolling = "native"),
            this.emit(),
            this.velocity !== 0 &&
              (this._resetVelocityTimeout = setTimeout(() => {
                ((this.lastVelocity = this.velocity),
                  (this.velocity = 0),
                  (this.isScrolling = !1),
                  this.emit());
              }, 400)));
        }
      }),
      (window.lenisVersion = "1.1.13"),
      (e && e !== document.documentElement && e !== document.body) ||
        (e = window),
      (this.options = {
        wrapper: e,
        content: r,
        eventsTarget: t,
        smoothWheel: i,
        syncTouch: n,
        syncTouchLerp: a,
        touchInertiaMultiplier: o,
        duration: h,
        easing: m,
        lerp: R,
        infinite: k,
        gestureOrientation: u,
        orientation: p,
        touchMultiplier: g,
        wheelMultiplier: I,
        autoResize: Y,
        prevent: J,
        virtualScroll: W,
        __experimental__naiveDimensions: le,
      }),
      (this.dimensions = new Kn(e, r, { autoResize: Y })),
      this.updateClassName(),
      (this.targetScroll = this.animatedScroll = this.actualScroll),
      this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1),
      this.options.wrapper.addEventListener(
        "pointerdown",
        this.onPointerDown,
        !1,
      ),
      (this.virtualScroll = new Zn(t, {
        touchMultiplier: g,
        wheelMultiplier: I,
      })),
      this.virtualScroll.on("scroll", this.onVirtualScroll));
  }
  destroy() {
    (this.emitter.destroy(),
      this.options.wrapper.removeEventListener(
        "scroll",
        this.onNativeScroll,
        !1,
      ),
      this.options.wrapper.removeEventListener(
        "pointerdown",
        this.onPointerDown,
        !1,
      ),
      this.virtualScroll.destroy(),
      this.dimensions.destroy(),
      this.cleanUpClassName());
  }
  on(e, r) {
    return this.emitter.on(e, r);
  }
  off(e, r) {
    return this.emitter.off(e, r);
  }
  setScroll(e) {
    this.isHorizontal
      ? (this.rootElement.scrollLeft = e)
      : (this.rootElement.scrollTop = e);
  }
  resize() {
    (this.dimensions.resize(),
      (this.animatedScroll = this.targetScroll = this.actualScroll),
      this.emit());
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    ((this.isLocked = !1),
      (this.isScrolling = !1),
      (this.animatedScroll = this.targetScroll = this.actualScroll),
      (this.lastVelocity = this.velocity = 0),
      this.animate.stop());
  }
  start() {
    this.isStopped && ((this.isStopped = !1), this.reset());
  }
  stop() {
    this.isStopped ||
      ((this.isStopped = !0), this.animate.stop(), this.reset());
  }
  raf(e) {
    const r = e - (this.time || e);
    ((this.time = e), this.animate.advance(0.001 * r));
  }
  scrollTo(
    e,
    {
      offset: r = 0,
      immediate: t = !1,
      lock: i = !1,
      duration: n = this.options.duration,
      easing: a = this.options.easing,
      lerp: o = this.options.lerp,
      onStart: h,
      onComplete: m,
      force: R = !1,
      programmatic: k = !0,
      userData: p,
    } = {},
  ) {
    if ((!this.isStopped && !this.isLocked) || R) {
      if (typeof e == "string" && ["top", "left", "start"].includes(e)) e = 0;
      else if (typeof e == "string" && ["bottom", "right", "end"].includes(e))
        e = this.limit;
      else {
        let u;
        if (
          (typeof e == "string"
            ? (u = document.querySelector(e))
            : e instanceof HTMLElement && e?.nodeType && (u = e),
          u)
        ) {
          if (this.options.wrapper !== window) {
            const I = this.rootElement.getBoundingClientRect();
            r -= this.isHorizontal ? I.left : I.top;
          }
          const g = u.getBoundingClientRect();
          e = (this.isHorizontal ? g.left : g.top) + this.animatedScroll;
        }
      }
      if (typeof e == "number") {
        if (
          ((e += r),
          (e = Math.round(e)),
          this.options.infinite
            ? k && (this.targetScroll = this.animatedScroll = this.scroll)
            : (e = kn(0, e, this.limit)),
          e === this.targetScroll)
        )
          return (h?.(this), void (m == null || m(this)));
        if (((this.userData = p ?? {}), t))
          return (
            (this.animatedScroll = this.targetScroll = e),
            this.setScroll(this.scroll),
            this.reset(),
            this.preventNextNativeScrollEvent(),
            this.emit(),
            m?.(this),
            void (this.userData = {})
          );
        (k || (this.targetScroll = e),
          this.animate.fromTo(this.animatedScroll, e, {
            duration: n,
            easing: a,
            lerp: o,
            onStart: () => {
              (i && (this.isLocked = !0),
                (this.isScrolling = "smooth"),
                h?.(this));
            },
            onUpdate: (u, g) => {
              ((this.isScrolling = "smooth"),
                (this.lastVelocity = this.velocity),
                (this.velocity = u - this.animatedScroll),
                (this.direction = Math.sign(this.velocity)),
                (this.animatedScroll = u),
                this.setScroll(this.scroll),
                k && (this.targetScroll = u),
                g || this.emit(),
                g &&
                  (this.reset(),
                  this.emit(),
                  m?.(this),
                  (this.userData = {}),
                  this.preventNextNativeScrollEvent()));
            },
          }));
      }
    }
  }
  preventNextNativeScrollEvent() {
    ((this._preventNextNativeScrollEvent = !0),
      requestAnimationFrame(() => {
        this._preventNextNativeScrollEvent = !1;
      }));
  }
  get rootElement() {
    return this.options.wrapper === window
      ? document.documentElement
      : this.options.wrapper;
  }
  get limit() {
    return this.options.__experimental__naiveDimensions
      ? this.isHorizontal
        ? this.rootElement.scrollWidth - this.rootElement.clientWidth
        : this.rootElement.scrollHeight - this.rootElement.clientHeight
      : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  get actualScroll() {
    return this.isHorizontal
      ? this.rootElement.scrollLeft
      : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite
      ? (function (r, t) {
          return ((r % t) + t) % t;
        })(this.animatedScroll, this.limit)
      : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(e) {
    this._isScrolling !== e &&
      ((this._isScrolling = e), this.updateClassName());
  }
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(e) {
    this._isStopped !== e && ((this._isStopped = e), this.updateClassName());
  }
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(e) {
    this._isLocked !== e && ((this._isLocked = e), this.updateClassName());
  }
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  get className() {
    let e = "lenis";
    return (
      this.isStopped && (e += " lenis-stopped"),
      this.isLocked && (e += " lenis-locked"),
      this.isScrolling && (e += " lenis-scrolling"),
      this.isScrolling === "smooth" && (e += " lenis-smooth"),
      e
    );
  }
  updateClassName() {
    (this.cleanUpClassName(),
      (this.rootElement.className =
        `${this.rootElement.className} ${this.className}`.trim()));
  }
  cleanUpClassName() {
    this.rootElement.className = this.rootElement.className
      .replace(/lenis(-\w+)?/g, "")
      .trim();
  }
}
function Qn(s, e) {
  let r = 0.45;
  return e == -1 ? s * (1 - r) : s * r;
}
const Tr = Mn({ loaded: !1 });
$e.registerPlugin(A);
class jn extends HTMLElement {
  customScroll;
  tiles;
  tilesInner;
  scrollY;
  currentTranslate;
  currentDirection;
  maxTranslate;
  container;
  images;
  raf;
  velocity;
  data;
  speed;
  direction;
  html;
  mouseClick;
  windowClick;
  isLocked;
  isRepositioning;
  translateValue;
  storeKey;
  store;
  resize;
  prevSelection;
  text;
  constructor() {
    (super(),
      (this.tiles = [...this.querySelectorAll(".tile")]),
      (this.tilesInner = [...this.querySelectorAll(".tile-inner")]),
      (this.container = this),
      (this.images = [...this.querySelectorAll("img")]),
      (this.raf = this.onRaf.bind(this)),
      (this.scrollY = 0),
      (this.currentTranslate = Number(this.getAttribute("initialTranslate"))),
      (this.currentDirection = -1),
      (this.maxTranslate = this.container.offsetHeight),
      (this.data = []),
      (this.speed = this.getAttribute("speed")),
      (this.direction = this.getAttribute("direction")),
      (this.storeKey = this.getAttribute("storeKey")),
      (this.velocity = 0),
      (this.html = document.querySelector("html")),
      (this.mouseClick = this.manageMouseClick.bind(this)),
      (this.windowClick = this.manageWindowClick.bind(this)),
      (this.isLocked = !1),
      (this.isRepositioning = !1),
      (this.translateValue = 0),
      (this.resize = this.manageResize.bind(this)),
      (this.text = document.querySelector(`.text-${this.storeKey}`)),
      this.init());
  }
  init() {
    ((this.customScroll = new Jn({
      easing: (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
      infinite: !0,
      syncTouch: !0,
      wheelMultiplier: 0.35,
      touchMultiplier: 0.5,
    })),
      this.customScroll.on("scroll", ({ velocity: e }) => {
        this.manageScroll(e * this.speed, Math.sign(e) * this.direction);
      }),
      window.addEventListener("resize", this.resize),
      window.addEventListener("click", this.windowClick));
    for (let e = 0; e < this.tiles.length; e++)
      (this.tilesInner[e].addEventListener("click", this.mouseClick),
        this.data.push({ top: 0, height: 0, translate: 0 }));
    (this.computeMetrics(),
      Xt.listen((e) => {
        this.storeKey == "columnA"
          ? e.columnB && this.slowStopCarousel()
          : e.columnA && this.slowStopCarousel();
      }),
      Tr.listen((e) => this.entryAnimation()),
      $e.ticker.add(this.raf));
  }
  entryAnimation() {
    const e = $e.timeline();
    (e.to(this.tiles, {
      opacity: 1,
      duration: 0.5,
      ease: "none",
      onComplete: () => {},
    }),
      e.to(this.images, {
        opacity: 1,
        duration: 0.5,
        ease: "none",
        onComplete: () => {
          this.container.classList.add("-loaded");
        },
      }));
    const r = Math.floor(Math.random() * 2 + 2);
    var t = { value: window.innerHeight * r * this.speed * this.direction };
    let i = 0;
    (setTimeout(() => {
      this.tilesInner.forEach((n) => (n.style.pointerEvents = "auto"));
    }, 1e3),
      $e.to(t, {
        duration: 2,
        value: 0,
        onUpdate: () => {
          ((this.translateValue = i - t.value), (i = t.value));
        },
        onComplete: () => {
          this.translateValue = 0;
        },
        ease: "power3.out",
      }));
  }
  slowStopCarousel() {
    var e = { value: this.scrollY };
    $e.to(e, {
      duration: 1,
      value: 0,
      onUpdate: () => {
        this.scrollY = e.value;
      },
      onComplete: () => {
        this.scrollY = 0;
      },
      ease: "power3.out",
    });
  }
  manageWindowClick(e) {
    e.target.classList.contains("groups") && this.unSelectAll();
  }
  manageMouseClick(e) {
    if (this.isRepositioning) return;
    if (
      (this.container.style.setProperty(
        "--translate",
        (this.data[0].height / 2).toString() + "px",
      ),
      e.target.classList.contains("-active"))
    ) {
      this.unSelectAll();
      return;
    } else this.unSelectAll();
    this.repositionSlider(
      e.target.parentNode,
      getComputedStyle(e.target).getPropertyValue("--scale"),
    );
    let r = 0;
    (e.target != this.prevSelection && (r = 300),
      setTimeout(() => {
        this.computeOrder(e.target);
        let t = e.target.parentNode;
        ((t.style.zIndex = "99"),
          (this.prevSelection = e.target),
          e.target.classList.add("-active"),
          Xt.setKey(this.storeKey, e.target.getAttribute("data-caption")),
          this.setText(e.target),
          this.lock());
      }, r));
  }
  repositionSlider(e, r) {
    if (!Pr.value) return;
    ((this.scrollY = 0), (this.velocity = 0), (this.isRepositioning = !0));
    const t = Qn(Pr.value?.height, this.direction),
      { top: i, height: n } = e.getBoundingClientRect();
    let a = i - t + n / 2;
    var o = { value: 0 };
    let h = 0;
    $e.to(o, {
      duration: 0.29,
      value: a,
      onUpdate: () => {
        ((this.translateValue = h - o.value), (h = o.value));
      },
      onComplete: () => {
        this.translateValue = 0;
      },
    });
  }
  setText(e) {
    ((this.text.innerHTML = e.getAttribute("data-text") ?? ""),
      setTimeout(() => {
        const { bottom: r, right: t, left: i } = e.getBoundingClientRect();
        if (this.storeKey == "columnA") {
          const n = this.container.getBoundingClientRect().left;
          $e.set(this.text, { left: n - 355, y: r + 10 });
        } else {
          const n = this.container.getBoundingClientRect().right;
          $e.set(this.text, { left: n + 10, y: r + 10 });
        }
        this.isRepositioning = !1;
      }, 175));
  }
  lock() {
    (this.customScroll.stop(),
      (this.scrollY = 0),
      (this.velocity = 0),
      this.container.parentElement?.classList.add("-locked"),
      this.container.classList.add("-locked"),
      (this.isLocked = !0));
  }
  computeOrder(e) {
    const r = e.getBoundingClientRect().top;
    for (let t = 0; t < this.tilesInner.length; t++) {
      const i = this.tilesInner[t].getBoundingClientRect().top;
      r > i
        ? this.tilesInner[t].classList.add("-translate-top")
        : r < i && this.tilesInner[t].classList.add("-translate-bottom");
    }
  }
  unlock() {
    (this.customScroll.start(),
      this.container.parentElement?.classList.remove("-locked"),
      this.container.classList.remove("-locked"),
      (this.isLocked = !1),
      Xt.setKey(this.storeKey, null));
  }
  unSelectAll() {
    for (let e = 0; e < this.tilesInner.length; e++) {
      let r = this.tilesInner[e].parentNode;
      ((r.style.zIndex = "1"),
        this.tilesInner[e].classList.remove("-active"),
        this.tilesInner[e].classList.remove("-translate-top"),
        this.tilesInner[e].classList.remove("-translate-bottom"));
    }
    this.unlock();
  }
  onRaf(e) {
    if ((this.translateValue, !this.isLocked)) {
      (this.manageTag(this.velocity),
        this.customScroll.raf(e * 1e3),
        (this.currentTranslate =
          (this.currentTranslate +
            this.translateValue +
            this.currentDirection * this.scrollY) %
          this.maxTranslate));
      for (let r = 0; r < this.tiles.length; r++) {
        let t;
        const i = this.data[r].top + this.data[r].height;
        (this.currentTranslate < i * -1
          ? (t = this.maxTranslate)
          : this.currentTranslate > this.maxTranslate - i
            ? (t = -this.maxTranslate)
            : (t = 0),
          (this.data[r].translate = t),
          $e.set(this.tiles[r], { y: t }));
      }
      $e.set(this.container, { y: this.currentTranslate });
    }
  }
  manageTag(e) {
    e > 1
      ? (this.container.classList.add("is-scrolling"), this.unSelectAll())
      : this.container.classList.remove("is-scrolling");
  }
  computeMetrics() {
    for (let e = 0; e < this.tiles.length; e++) {
      const { top: r, height: t } = this.tiles[e].getBoundingClientRect();
      ((this.data[e].top = r - this.currentTranslate - this.data[e].translate),
        (this.data[e].height = t));
    }
  }
  manageScroll(e, r) {
    this.isLocked ||
      ((this.velocity = Math.abs(e)),
      this.isRepositioning || (this.scrollY = Math.round(Math.abs(e))),
      (this.currentDirection = r != 0 ? r : this.currentDirection));
  }
  manageResize() {
    ((this.maxTranslate = this.container.offsetHeight),
      this.unSelectAll(),
      this.computeMetrics());
  }
  disconnectedCallback() {
    (Xt.set({ columnA: null, columnB: null }), this.customScroll.destroy());
  }
}
customElements.define("slider-el", jn);
class es extends HTMLElement {
  manageCombination;
  fusionButton;
  clickEvent;
  constructor() {
    (super(),
      (this.manageCombination = this.listenCombination.bind(this)),
      (this.fusionButton = this.querySelector(".c-fusion-button")),
      (this.clickEvent = this.manageClick.bind(this)),
      this.init());
  }
  init() {
    (this.fusionButton.addEventListener("click", this.clickEvent),
      Xt.listen((e, r) => {
        const t = Oi.get().images,
          i = e.columnA ?? null,
          n = e.columnB ?? null;
        if (!n || !i) {
          this.classList.remove("-active");
          return;
        }
        let a = !1;
        (t.forEach((o) => {
          const h = o.columnA ?? "",
            m = o.columnB ?? "";
          h + m == i + n && (a = !0);
        }),
          a
            ? (this.classList.remove("-able"), this.classList.add("-disable"))
            : (this.classList.add("-able"), this.classList.remove("-disable")),
          e.columnA && e.columnB
            ? this.classList.add("-active")
            : this.classList.remove("-active"));
      }));
  }
  manageClick() {
    const e = Xt.get(),
      r = Oi.get().images;
    let t = !1;
    for (let o = 0; o < r.length; o++) {
      const h = r[o];
      h.columnA == e.columnA && h.columnB == e.columnB && (t = !0);
    }
    t ||
      Oi.set({
        images: [
          ...Oi.get().images,
          { columnA: e.columnA, columnB: e.columnB },
        ],
      });
    const i = document.getElementsByTagName("html")[0].getAttribute("lang"),
      n = i == "fr" ? "combinaisons" : "combinations",
      a = Rn.get().navigate;
    a(`/${i}/${n}/` + e.columnA + e.columnB);
  }
  listenCombination() {}
}
customElements.define("combination-button", es);
class ts extends HTMLElement {
  constructor() {
    (super(), this.init());
  }
  init() {
    Xt.listen((e) => {
      e.columnA && e.columnB
        ? this.classList.add("-active")
        : this.classList.remove("-active");
    });
  }
}
customElements.define("group-el", ts);
$e.registerPlugin(jr);
class is extends HTMLElement {
  texts;
  images;
  imageContainers;
  container;
  constructor() {
    (super(),
      (this.container = document.querySelectorAll(".c-preloader")),
      (this.texts = document.querySelectorAll(".c-preloader_text span")),
      (this.imageContainers = document.querySelectorAll(
        ".c-preloader_image_container",
      )),
      (this.images = document.querySelectorAll(".second-image")),
      this.init());
  }
  init() {
    const e = document.getElementsByTagName("html")[0];
    if (e.classList.contains("preloaded")) {
      ($e.to(this, { scale: 0, left: "50%", top: "50%" }),
        requestAnimationFrame(() => {
          Tr.set({ loaded: !0 });
        }));
      return;
    } else e.classList.add("preloaded");
    const r = jr.create("easeName", "0.33, 1, 0.68, 1");
    let t = $e.timeline();
    (t.to(this.texts, {
      y: 0,
      opacity: 1,
      stagger: 0.035,
      duration: 0.35,
      ease: r,
    }),
      t.to(
        this.images,
        {
          scale: 1,
          duration: 0.65,
          stagger: 0.04,
          ease: r,
          onComplete: () => this.moveImages(),
        },
        ">=0.1",
      ),
      t.to(
        this,
        { scale: 0, left: "50%", top: "50%", duration: 0.75, ease: r },
        "+=0.85",
      ));
  }
  moveImages() {
    (this.imageContainers.forEach((e) => {
      e.classList.add("-active");
    }),
      setTimeout(() => {
        Tr.set({ loaded: !0 });
      }, 500));
  }
}
customElements.define("preloader-el", is);
