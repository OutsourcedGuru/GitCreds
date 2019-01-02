/*!
  * bean.js - copyright Jacob Thornton 2011
  * https://github.com/fat/bean
  * MIT License
  * special thanks to:
  * dean edwards: http://dean.edwards.name/
  * dperini: https://github.com/dperini/nwevents
  * the entire mootools team: github.com/mootools/mootools-core
  */
 !function(a, c, b) {
  if (typeof module !== "undefined") {
      module.exports = b(a, c)
  } else {
      if (typeof define === "function" && typeof define.amd === "object") {
          define(b)
      } else {
          c[a] = b(a, c)
      }
  }
}("bean", this, function(p, R) {
  var J = window,
      L = R[p],
      I = /over|out/,
      z = /[^\.]*(?=\..*)\.|.*/,
      H = /\..*/,
      o = "addEventListener",
      h = "attachEvent",
      a = "removeEventListener",
      r = "detachEvent",
      k = document || {},
      A = k.documentElement || {},
      u = A[o],
      B = u ? o : h,
      s = Array.prototype.slice,
      c = /click|mouse|menu|drag|drop/i,
      K = /^touch|^gesture/i,
      F = {
          one: 1
      },
      P = (function(U, T, S) {
          for (S = 0; S < T.length; S++) {
              U[T[S]] = 1
          }
          return U
      })({}, ("click dblclick mouseup mousedown contextmenu mousewheel DOMMouseScroll mouseover mouseout mousemove selectstart selectend keydown keypress keyup orientationchange focus blur change reset select submit load unload beforeunload resize move DOMContentLoaded readystatechange error abort scroll " + (u ? "show input invalid touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend message readystatechange pageshow pagehide popstate hashchange offline online afterprint beforeprint dragstart dragenter dragover dragleave drag drop dragend loadstart progress suspend emptied stalled loadmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange volumechange cuechange checking noupdate downloading cached updateready obsolete " : "")).split(" ")),
      E = (function() {
          function T(U, V) {
              while ((V = V.parentNode) !== null) {
                  if (V === U) {
                      return true
                  }
              }
              return false
          }
          function S(U) {
              var V = U.relatedTarget;
              if (!V) {
                  return V === null
              }
              return ( V !== this && V.prefix !== "xul" && !/document/.test(this.toString()) && !T(this, V))
          }
          return {
              mouseenter: {
                  base: "mouseover",
                  condition: S
              },
              mouseleave: {
                  base: "mouseout",
                  condition: S
              },
              mousewheel: {
                  base: /Firefox/.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel"
              }
          }
      })(),
      Q = (function() {
          var Z = "altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey srcElement target timeStamp type view which".split(" "),
              W = Z.concat("button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" ")),
              T = Z.concat("char charCode key keyCode".split(" ")),
              Y = Z.concat("touches targetTouches changedTouches scale rotation".split(" ")),
              V = "preventDefault",
              ab = function(ac) {
                  return function() {
                      if (ac[V]) {
                          ac[V]()
                      } else {
                          ac.returnValue = false
                      }
                  }
              },
              X = "stopPropagation",
              aa = function(ac) {
                  return function() {
                      if (ac[X]) {
                          ac[X]()
                      } else {
                          ac.cancelBubble = true
                      }
                  }
              },
              U = function(ac) {
                  return function() {
                      ac[V]();
                      ac[X]();
                      ac.stopped = true
                  }
              },
              S = function(af, ac, ae) {
                  var ad,
                      ag;
                  for (ad = ae.length; ad--;) {
                      ag = ae[ad];
                      if (!(ag in ac) && ag in af) {
                          ac[ag] = af[ag]
                      }
                  }
              };
          return function(ag, ad) {
              var ac = {
                  originalEvent: ag,
                  isNative: ad
              };
              if (!ag) {
                  return ac
              }
              var af,
                  ae = ag.type,
                  ah = ag.target || ag.srcElement;
              ac[V] = ab(ag);
              ac[X] = aa(ag);
              ac.stop = U(ac);
              ac.target = ah && ah.nodeType === 3 ? ah.parentNode : ah;
              if (ad) {
                  if (ae.indexOf("key") !== -1) {
                      af = T;
                      ac.keyCode = ag.which || ag.keyCode
                  } else {
                      if (c.test(ae)) {
                          af = W;
                          ac.rightClick = ag.which === 3 || ag.button === 2;
                          ac.pos = {
                              x: 0,
                              y: 0
                          };
                          if (ag.pageX || ag.pageY) {
                              ac.clientX = ag.pageX;
                              ac.clientY = ag.pageY
                          } else {
                              if (ag.clientX || ag.clientY) {
                                  ac.clientX = ag.clientX + k.body.scrollLeft + A.scrollLeft;
                                  ac.clientY = ag.clientY + k.body.scrollTop + A.scrollTop
                              }
                          }
                          if (I.test(ae)) {
                              ac.relatedTarget = ag.relatedTarget || ag[(ae === "mouseover" ? "from" : "to") + "Element"]
                          }
                      } else {
                          if (K.test(ae)) {
                              af = Y
                          }
                      }
                  }
                  S(ag, ac, af || Z)
              }
              return ac
          }
      })(),
      d = function(T, S) {
          return !u && !S && (T === k || T === J) ? A : T
      },
      m = (function() {
          function S(U, W, V, T, X) {
              this.element = U;
              this.type = W;
              this.handler = V;
              this.original = T;
              this.namespaces = X;
              this.custom = E[W];
              this.isNative = P[W] && U[B];
              this.eventType = u || this.isNative ? W : "propertychange";
              this.customType = !u && !this.isNative && W;
              this.target = d(U, this.isNative);
              this.eventSupport = this.target[B]
          }
          S.prototype = {
              inNamespaces: function(V) {
                  var U,
                      T;
                  if (!V) {
                      return true
                  }
                  if (!this.namespaces) {
                      return false
                  }
                  for (U = V.length; U--;) {
                      for (T = this.namespaces.length; T--;) {
                          if (V[U] === this.namespaces[T]) {
                              return true
                          }
                      }
                  }
                  return false
              },
              matches: function(U, T, V) {
                  return this.element === U && (!T || this.original === T) && (!V || this.handler === V)
              }
          };
          return S
      })(),
      O = (function() {
          var X = {},
              W = function(ab, ae, Z, ah, af) {
                  if (!ae || ae === "*") {
                      for (var ai in X) {
                          if (ai.charAt(0) === "$") {
                              W(ab, ai.substr(1), Z, ah, af)
                          }
                      }
                  } else {
                      var ac = 0,
                          aa,
                          ad = X["$" + ae],
                          ag = ab === "*";
                      if (!ad) {
                          return
                      }
                      for (aa = ad.length; ac < aa; ac++) {
                          if (ag || ad[ac].matches(ab, Z, ah)) {
                              if (!af(ad[ac], ad, ac, ae)) {
                                  return
                              }
                          }
                      }
                  }
              },
              V = function(ab, ac, aa) {
                  var Z,
                      ad = X["$" + ac];
                  if (ad) {
                      for (Z = ad.length; Z--;) {
                          if (ad[Z].matches(ab, aa, null)) {
                              return true
                          }
                      }
                  }
                  return false
              },
              U = function(ab, ac, aa) {
                  var Z = [];
                  W(ab, ac, aa, null, function(ad) {
                      return Z.push(ad)
                  });
                  return Z
              },
              Y = function(Z) {
                  (X["$" + Z.type] || (X["$" + Z.type] = [])).push(Z);
                  return Z
              },
              T = function(Z) {
                  W(Z.element, Z.type, null, Z.handler, function(ab, ac, aa) {
                      ac.splice(aa, 1);
                      if (ac.length === 0) {
                          delete X["$" + ab.type]
                      }
                      return false
                  })
              },
              S = function() {
                  var aa,
                      Z = [];
                  for (aa in X) {
                      if (aa.charAt(0) === "$") {
                          Z = Z.concat(X[aa])
                      }
                  }
                  return Z
              };
          return {
              has: V,
              get: U,
              put: Y,
              del: T,
              entries: S
          }
      })(),
      M = u ? function(S, U, T, V) {
          S[V ? o : a](U, T, false)
      } : function(S, U, T, W, V) {
          if (V && W && S["_on" + V] === null) {
              S["_on" + V] = 0
          }
          S[W ? h : r]("on" + U, T)
      },
      D = function(T, U, S) {
          return function(V) {
              V = Q(V || ((this.ownerDocument || this.document || this).parentWindow || J).event, true);
              return U.apply(T, [V].concat(S))
          }
      },
      f = function(U, W, V, X, T, S) {
          return function(Y) {
              if (X ? X.apply(this, arguments) : u ? true : Y && Y.propertyName === "_on" + V || !Y) {
                  if (Y) {
                      Y = Q(Y || ((this.ownerDocument || this.document || this).parentWindow || J).event, S)
                  }
                  W.apply(U, Y && (!T || T.length === 0) ? arguments : s.call(arguments, Y ? 0 : 1).concat(T))
              }
          }
      },
      w = function(W, S, U, T, V) {
          return function() {
              W(S, U, V);
              T.apply(this, arguments)
          }
      },
      b = function(W, U, aa, S) {
          var X,
              V,
              Z,
              Y = (U && U.replace(H, "")),
              T = O.get(W, Y, aa);
          for (X = 0, V = T.length; X < V; X++) {
              if (T[X].inNamespaces(S)) {
                  if ((Z = T[X]).eventSupport) {
                      M(Z.target, Z.eventType, Z.handler, false, Z.type)
                  }
                  O.del(Z)
              }
          }
      },
      j = function(T, Z, V, Y, S) {
          var W,
              U = Z.replace(H, ""),
              X = Z.replace(z, "").split(".");
          if (O.has(T, U, V)) {
              return T
          }
          if (U === "unload") {
              V = w(b, T, U, V, Y)
          }
          if (E[U]) {
              if (E[U].condition) {
                  V = f(T, V, U, E[U].condition, true)
              }
              U = E[U].base || U
          }
          W = O.put(new m(T, U, V, Y, X[0] && X));
          W.handler = W.isNative ? D(T, W.handler, S) : f(T, W.handler, U, false, S, false);
          if (W.eventSupport) {
              M(W.target, W.eventType, W.handler, true, W.customType)
          }
      },
      q = function(S, T, U) {
          return function(X) {
              var W,
                  V,
                  Y = typeof S === "string" ? U(S, this) : S;
              for (W = X.target; W && W !== this; W = W.parentNode) {
                  for (V = Y.length; V--;) {
                      if (Y[V] === W) {
                          return T.apply(W, arguments)
                      }
                  }
              }
          }
      },
      C = function(W, Z, ab) {
          var V,
              U,
              aa,
              T,
              X,
              Y = b,
              S = Z && typeof Z === "string";
          if (S && Z.indexOf(" ") > 0) {
              Z = Z.split(" ");
              for (X = Z.length; X--;) {
                  C(W, Z[X], ab)
              }
              return W
          }
          aa = S && Z.replace(H, "");
          if (aa && E[aa]) {
              aa = E[aa].type
          }
          if (!Z || S) {
              if (T = S && Z.replace(z, "")) {
                  T = T.split(".")
              }
              Y(W, aa, ab, T)
          } else {
              if (typeof Z === "function") {
                  Y(W, null, Z)
              } else {
                  for (V in Z) {
                      if (Z.hasOwnProperty(V)) {
                          C(W, V, Z[V])
                      }
                  }
              }
          }
          return W
      },
      g = function(U, ac, aa, S, T) {
          var Y,
              W,
              V,
              X,
              Z = aa,
              ab = aa && typeof aa === "string";
          if (ac && !aa && typeof ac === "object") {
              for (Y in ac) {
                  if (ac.hasOwnProperty(Y)) {
                      g.apply(this, [U, Y, ac[Y]])
                  }
              }
          } else {
              X = arguments.length > 3 ? s.call(arguments, 3) : [];
              W = (ab ? aa : ac).split(" ");
              ab && (aa = q(ac, (Z = S), T)) && (X = s.call(X, 1));
              this === F && (aa = w(C, U, ac, aa, Z));
              for (V = W.length; V--;) {
                  j(U, W[V], aa, Z, X)
              }
          }
          return U
      },
      l = function() {
          return g.apply(F, arguments)
      },
      N = u ? function(T, V, U) {
          var S = k.createEvent(T ? "HTMLEvents" : "UIEvents");
          S[T ? "initEvent" : "initUIEvent"](V, true, true, J, 1);
          U.dispatchEvent(S)
      } : function(S, U, T) {
          T = d(T, S);
          S ? T.fireEvent("on" + U, k.createEventObject()) : T["_on" + U]++
      },
      v = function(V, aa, Y) {
          var W,
              U,
              T,
              Z,
              S,
              X = aa.split(" ");
          for (W = X.length; W--;) {
              aa = X[W].replace(H, "");
              if (Z = X[W].replace(z, "")) {
                  Z = Z.split(".")
              }
              if (!Z && !Y && V[B]) {
                  N(P[aa], aa, V)
              } else {
                  S = O.get(V, aa);
                  Y = [false].concat(Y);
                  for (U = 0, T = S.length; U < T; U++) {
                      if (S[U].inNamespaces(Z)) {
                          S[U].handler.apply(V, Y)
                      }
                  }
              }
          }
          return V
      },
      t = function(V, X, W) {
          var U = 0,
              T = O.get(X, W),
              S = T.length;
          for (; U < S; U++) {
              T[U].original && g(V, T[U].type, T[U].original)
          }
          return V
      },
      G = {
          add: g,
          one: l,
          remove: C,
          clone: t,
          fire: v,
          noConflict: function() {
              R[p] = L;
              return this
          }
      };
  if (J[h]) {
      var e = function() {
          var T,
              S = O.entries();
          for (T in S) {
              if (S[T].type && S[T].type !== "unload") {
                  C(S[T].element, S[T].type)
              }
          }
          J[r]("onunload", e);
          J.CollectGarbage && J.CollectGarbage()
      };
      J[h]("onunload", e)
  }
  return G
});
(function() {
  var w = this;
  var t = w._;
  var b = {};
  var j = Array.prototype,
      F = Object.prototype,
      H = Function.prototype;
  var u = j.slice,
      A = j.unshift,
      z = F.toString,
      q = F.hasOwnProperty;
  var o = j.forEach,
      h = j.map,
      D = j.reduce,
      e = j.reduceRight,
      m = j.filter,
      a = j.every,
      C = j.some,
      v = j.indexOf,
      f = j.lastIndexOf,
      c = Array.isArray,
      E = Object.keys,
      k = H.bind;
  var G = function(I) {
      return new g(I)
  };
  if (typeof module !== "undefined" && module.exports) {
      module.exports = G;
      G._ = G
  } else {
      w._ = G
  }
  G.VERSION = "1.1.7";
  var d = G.each = G.forEach = function(N, M, L) {
      if (N == null) {
          return
      }
      if (o && N.forEach === o) {
          N.forEach(M, L)
      } else {
          if (N.length === +N.length) {
              for (var K = 0, I = N.length; K < I; K++) {
                  if (K in N && M.call(L, N[K], K, N) === b) {
                      return
                  }
              }
          } else {
              for (var J in N) {
                  if (q.call(N, J)) {
                      if (M.call(L, N[J], J, N) === b) {
                          return
                      }
                  }
              }
          }
      }
  };
  G.map = function(L, K, J) {
      var I = [];
      if (L == null) {
          return I
      }
      if (h && L.map === h) {
          return L.map(K, J)
      }
      d(L, function(O, M, N) {
          I[I.length] = K.call(J, O, M, N)
      });
      return I
  };
  G.reduce = G.foldl = G.inject = function(M, L, I, K) {
      var J = I !== void 0;
      if (M == null) {
          M = []
      }
      if (D && M.reduce === D) {
          if (K) {
              L = G.bind(L, K)
          }
          return J ? M.reduce(L, I) : M.reduce(L)
      }
      d(M, function(P, N, O) {
          if (!J) {
              I = P;
              J = true
          } else {
              I = L.call(K, I, P, N, O)
          }
      });
      if (!J) {
          throw new TypeError("Reduce of empty array with no initial value")
      }
      return I
  };
  G.reduceRight = G.foldr = function(L, K, I, J) {
      if (L == null) {
          L = []
      }
      if (e && L.reduceRight === e) {
          if (J) {
              K = G.bind(K, J)
          }
          return I !== void 0 ? L.reduceRight(K, I) : L.reduceRight(K)
      }
      var M = (G.isArray(L) ? L.slice() : G.toArray(L)).reverse();
      return G.reduce(M, K, I, J)
  };
  G.find = G.detect = function(L, K, J) {
      var I;
      r(L, function(O, M, N) {
          if (K.call(J, O, M, N)) {
              I = O;
              return true
          }
      });
      return I
  };
  G.filter = G.select = function(L, K, J) {
      var I = [];
      if (L == null) {
          return I
      }
      if (m && L.filter === m) {
          return L.filter(K, J)
      }
      d(L, function(O, M, N) {
          if (K.call(J, O, M, N)) {
              I[I.length] = O
          }
      });
      return I
  };
  G.reject = function(L, K, J) {
      var I = [];
      if (L == null) {
          return I
      }
      d(L, function(O, M, N) {
          if (!K.call(J, O, M, N)) {
              I[I.length] = O
          }
      });
      return I
  };
  G.every = G.all = function(L, K, J) {
      var I = true;
      if (L == null) {
          return I
      }
      if (a && L.every === a) {
          return L.every(K, J)
      }
      d(L, function(O, M, N) {
          if (!(I = I && K.call(J, O, M, N))) {
              return b
          }
      });
      return I
  };
  var r = G.some = G.any = function(L, K, J) {
      K = K || G.identity;
      var I = false;
      if (L == null) {
          return I
      }
      if (C && L.some === C) {
          return L.some(K, J)
      }
      d(L, function(O, M, N) {
          if (I |= K.call(J, O, M, N)) {
              return b
          }
      });
      return !!I
  };
  G.include = G.contains = function(K, J) {
      var I = false;
      if (K == null) {
          return I
      }
      if (v && K.indexOf === v) {
          return K.indexOf(J) != -1
      }
      r(K, function(L) {
          if (I = L === J) {
              return true
          }
      });
      return I
  };
  G.invoke = function(J, K) {
      var I = u.call(arguments, 2);
      return G.map(J, function(L) {
          return (K.call ? K || L : L[K]).apply(L, I)
      })
  };
  G.pluck = function(J, I) {
      return G.map(J, function(K) {
          return K[I]
      })
  };
  G.max = function(L, K, J) {
      if (!K && G.isArray(L)) {
          return Math.max.apply(Math, L)
      }
      var I = {
          computed: -Infinity
      };
      d(L, function(P, M, O) {
          var N = K ? K.call(J, P, M, O) : P;
          N >= I.computed && (I = {
              value: P,
              computed: N
          })
      });
      return I.value
  };
  G.min = function(L, K, J) {
      if (!K && G.isArray(L)) {
          return Math.min.apply(Math, L)
      }
      var I = {
          computed: Infinity
      };
      d(L, function(P, M, O) {
          var N = K ? K.call(J, P, M, O) : P;
          N < I.computed && (I = {
              value: P,
              computed: N
          })
      });
      return I.value
  };
  G.sortBy = function(K, J, I) {
      return G.pluck(G.map(K, function(N, L, M) {
          return {
              value: N,
              criteria: J.call(I, N, L, M)
          }
      }).sort(function(O, N) {
          var M = O.criteria,
              L = N.criteria;
          return M < L ? -1 : M > L ? 1 : 0
      }), "value")
  };
  G.groupBy = function(K, J) {
      var I = {};
      d(K, function(N, L) {
          var M = J(N, L);
          (I[M] || (I[M] = [])).push(N)
      });
      return I
  };
  G.sortedIndex = function(N, M, K) {
      K || (K = G.identity);
      var I = 0,
          L = N.length;
      while (I < L) {
          var J = (I + L) >> 1;
          K(N[J]) < K(M) ? I = J + 1 : L = J
      }
      return I
  };
  G.toArray = function(I) {
      if (!I) {
          return []
      }
      if (I.toArray) {
          return I.toArray()
      }
      if (G.isArray(I)) {
          return u.call(I)
      }
      if (G.isArguments(I)) {
          return u.call(I)
      }
      return G.values(I)
  };
  G.size = function(I) {
      return G.toArray(I).length
  };
  G.first = G.head = function(K, J, I) {
      return (J != null) && !I ? u.call(K, 0, J) : K[0]
  };
  G.rest = G.tail = function(K, I, J) {
      return u.call(K, (I == null) || J ? 1 : I)
  };
  G.last = function(I) {
      return I[I.length - 1]
  };
  G.compact = function(I) {
      return G.filter(I, function(J) {
          return !!J
      })
  };
  G.flatten = function(I) {
      return G.reduce(I, function(J, K) {
          if (G.isArray(K)) {
              return J.concat(G.flatten(K))
          }
          J[J.length] = K;
          return J
      }, [])
  };
  G.without = function(I) {
      return G.difference(I, u.call(arguments, 1))
  };
  G.uniq = G.unique = function(J, I) {
      return G.reduce(J, function(K, M, L) {
          if (0 == L || (I === true ? G.last(K) != M : !G.include(K, M))) {
              K[K.length] = M
          }
          return K
      }, [])
  };
  G.union = function() {
      return G.uniq(G.flatten(arguments))
  };
  G.intersection = G.intersect = function(J) {
      var I = u.call(arguments, 1);
      return G.filter(G.uniq(J), function(K) {
          return G.every(I, function(L) {
              return G.indexOf(L, K) >= 0
          })
      })
  };
  G.difference = function(J, I) {
      return G.filter(J, function(K) {
          return !G.include(I, K)
      })
  };
  G.zip = function() {
      var I = u.call(arguments);
      var L = G.max(G.pluck(I, "length"));
      var K = new Array(L);
      for (var J = 0; J < L; J++) {
          K[J] = G.pluck(I, "" + J)
      }
      return K
  };
  G.indexOf = function(M, K, L) {
      if (M == null) {
          return -1
      }
      var J,
          I;
      if (L) {
          J = G.sortedIndex(M, K);
          return M[J] === K ? J : -1
      }
      if (v && M.indexOf === v) {
          return M.indexOf(K)
      }
      for (J = 0, I = M.length; J < I; J++) {
          if (M[J] === K) {
              return J
          }
      }
      return -1
  };
  G.lastIndexOf = function(K, J) {
      if (K == null) {
          return -1
      }
      if (f && K.lastIndexOf === f) {
          return K.lastIndexOf(J)
      }
      var I = K.length;
      while (I--) {
          if (K[I] === J) {
              return I
          }
      }
      return -1
  };
  G.range = function(N, L, M) {
      if (arguments.length <= 1) {
          L = N || 0;
          N = 0
      }
      M = arguments[2] || 1;
      var J = Math.max(Math.ceil((L - N) / M), 0);
      var I = 0;
      var K = new Array(J);
      while (I < J) {
          K[I++] = N;
          N += M
      }
      return K
  };
  G.bind = function(J, K) {
      if (J.bind === k && k) {
          return k.apply(J, u.call(arguments, 1))
      }
      var I = u.call(arguments, 2);
      return function() {
          return J.apply(K, I.concat(u.call(arguments)))
      }
  };
  G.bindAll = function(J) {
      var I = u.call(arguments, 1);
      if (I.length == 0) {
          I = G.functions(J)
      }
      d(I, function(K) {
          J[K] = G.bind(J[K], J)
      });
      return J
  };
  G.memoize = function(K, J) {
      var I = {};
      J || (J = G.identity);
      return function() {
          var L = J.apply(this, arguments);
          return q.call(I, L) ? I[L] : (I[L] = K.apply(this, arguments))
      }
  };
  G.delay = function(J, K) {
      var I = u.call(arguments, 2);
      return setTimeout(function() {
          return J.apply(J, I)
      }, K)
  };
  G.defer = function(I) {
      return G.delay.apply(G, [I, 1].concat(u.call(arguments, 1)))
  };
  var B = function(J, L, I) {
      var K;
      return function() {
          var N = this,
              M = arguments;
          var O = function() {
              K = null;
              J.apply(N, M)
          };
          if (I) {
              clearTimeout(K)
          }
          if (I || !K) {
              K = setTimeout(O, L)
          }
      }
  };
  G.throttle = function(I, J) {
      return B(I, J, false)
  };
  G.debounce = function(I, J) {
      return B(I, J, true)
  };
  G.once = function(K) {
      var I = false,
          J;
      return function() {
          if (I) {
              return J
          }
          I = true;
          return J = K.apply(this, arguments)
      }
  };
  G.wrap = function(I, J) {
      return function() {
          var K = [I].concat(u.call(arguments));
          return J.apply(this, K)
      }
  };
  G.compose = function() {
      var I = u.call(arguments);
      return function() {
          var J = u.call(arguments);
          for (var K = I.length - 1; K >= 0; K--) {
              J = [I[K].apply(this, J)]
          }
          return J[0]
      }
  };
  G.after = function(J, I) {
      return function() {
          if (--J < 1) {
              return I.apply(this, arguments)
          }
      }
  };
  G.keys = E || function(K) {
      if (K !== Object(K)) {
          throw new TypeError("Invalid object")
      }
      var J = [];
      for (var I in K) {
          if (q.call(K, I)) {
              J[J.length] = I
          }
      }
      return J
  };
  G.values = function(I) {
      return G.map(I, G.identity)
  };
  G.functions = G.methods = function(K) {
      var J = [];
      for (var I in K) {
          if (G.isFunction(K[I])) {
              J.push(I)
          }
      }
      return J.sort()
  };
  G.extend = function(I) {
      d(u.call(arguments, 1), function(J) {
          for (var K in J) {
              if (J[K] !== void 0) {
                  I[K] = J[K]
              }
          }
      });
      return I
  };
  G.defaults = function(I) {
      d(u.call(arguments, 1), function(J) {
          for (var K in J) {
              if (I[K] == null) {
                  I[K] = J[K]
              }
          }
      });
      return I
  };
  G.clone = function(I) {
      return G.isArray(I) ? I.slice() : G.extend({}, I)
  };
  G.tap = function(J, I) {
      I(J);
      return J
  };
  G.isEqual = function(J, I) {
      if (J === I) {
          return true
      }
      var M = typeof (J),
          O = typeof (I);
      if (M != O) {
          return false
      }
      if (J == I) {
          return true
      }
      if ((!J && I) || (J && !I)) {
          return false
      }
      if (J._chain) {
          J = J._wrapped
      }
      if (I._chain) {
          I = I._wrapped
      }
      if (J.isEqual) {
          return J.isEqual(I)
      }
      if (I.isEqual) {
          return I.isEqual(J)
      }
      if (G.isDate(J) && G.isDate(I)) {
          return J.getTime() === I.getTime()
      }
      if (G.isNaN(J) && G.isNaN(I)) {
          return false
      }
      if (G.isRegExp(J) && G.isRegExp(I)) {
          return J.source === I.source && J.global === I.global && J.ignoreCase === I.ignoreCase && J.multiline === I.multiline
      }
      if (M !== "object") {
          return false
      }
      if (J.length && (J.length !== I.length)) {
          return false
      }
      var K = G.keys(J),
          N = G.keys(I);
      if (K.length != N.length) {
          return false
      }
      for (var L in J) {
          if (!(L in I) || !G.isEqual(J[L], I[L])) {
              return false
          }
      }
      return true
  };
  G.isEmpty = function(J) {
      if (G.isArray(J) || G.isString(J)) {
          return J.length === 0
      }
      for (var I in J) {
          if (q.call(J, I)) {
              return false
          }
      }
      return true
  };
  G.isElement = function(I) {
      return !!(I && I.nodeType == 1)
  };
  G.isArray = c || function(I) {
      return z.call(I) === "[object Array]"
  };
  G.isObject = function(I) {
      return I === Object(I)
  };
  G.isArguments = function(I) {
      return !!(I && q.call(I, "callee"))
  };
  G.isFunction = function(I) {
      return !!(I && I.constructor && I.call && I.apply)
  };
  G.isString = function(I) {
      return !!(I === "" || (I && I.charCodeAt && I.substr))
  };
  G.isNumber = function(I) {
      return !!(I === 0 || (I && I.toExponential && I.toFixed))
  };
  G.isNaN = function(I) {
      return I !== I
  };
  G.isBoolean = function(I) {
      return I === true || I === false
  };
  G.isDate = function(I) {
      return !!(I && I.getTimezoneOffset && I.setUTCFullYear)
  };
  G.isRegExp = function(I) {
      return !!(I && I.test && I.exec && (I.ignoreCase || I.ignoreCase === false))
  };
  G.isNull = function(I) {
      return I === null
  };
  G.isUndefined = function(I) {
      return I === void 0
  };
  G.noConflict = function() {
      w._ = t;
      return this
  };
  G.identity = function(I) {
      return I
  };
  G.times = function(L, K, J) {
      for (var I = 0; I < L; I++) {
          K.call(J, I)
      }
  };
  G.mixin = function(I) {
      d(G.functions(I), function(J) {
          s(J, G[J] = I[J])
      })
  };
  var l = 0;
  G.uniqueId = function(I) {
      var J = l++;
      return I ? I + J : J
  };
  G.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g
  };
  G.template = function(L, K) {
      var M = G.templateSettings;
      var I = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + L.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(M.interpolate, function(N, O) {
          return "'," + O.replace(/\\'/g, "'") + ",'"
      }).replace(M.evaluate || null, function(N, O) {
          return "');" + O.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ") + "__p.push('"
      }).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');";
      var J = new Function("obj", I);
      return K ? J(K) : J
  };
  var g = function(I) {
      this._wrapped = I
  };
  G.prototype = g.prototype;
  var p = function(J, I) {
      return I ? G(J).chain() : J
  };
  var s = function(I, J) {
      g.prototype[I] = function() {
          var K = u.call(arguments);
          A.call(K, this._wrapped);
          return p(J.apply(G, K), this._chain)
      }
  };
  G.mixin(G);
  d(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(I) {
      var J = j[I];
      g.prototype[I] = function() {
          J.apply(this._wrapped, arguments);
          return p(this._wrapped, this._chain)
      }
  });
  d(["concat", "join", "slice"], function(I) {
      var J = j[I];
      g.prototype[I] = function() {
          return p(J.apply(this._wrapped, arguments), this._chain)
      }
  });
  g.prototype.chain = function() {
      this._chain = true;
      return this
  };
  g.prototype.value = function() {
      return this._wrapped
  }
})();
(function() {
  var b = this,
      c = this.Flotr,
      a;
  a = {
      _: _,
      bean: bean,
      isIphone: /iphone/i.test(navigator.userAgent),
      isIE: (navigator.appVersion.indexOf("MSIE") != -1 ? parseFloat(navigator.appVersion.split("MSIE")[1]) : false),
      graphTypes: {},
      plugins: {},
      addType: function(d, e) {
          a.graphTypes[d] = e;
          a.defaultOptions[d] = e.options || {};
          a.defaultOptions.defaultType = a.defaultOptions.defaultType || d
      },
      addPlugin: function(d, e) {
          a.plugins[d] = e;
          a.defaultOptions[d] = e.options || {}
      },
      draw: function(e, f, d, g) {
          g = g || a.Graph;
          return new g(e, f, d)
      },
      merge: function(h, f) {
          var g,
              e,
              d = f || {};
          for (g in h) {
              e = h[g];
              if (e && typeof (e) === "object") {
                  if (e.constructor === Array) {
                      d[g] = this._.clone(e)
                  } else {
                      if (e.constructor !== RegExp && !this._.isElement(e)) {
                          d[g] = a.merge(e, (f ? f[g] : undefined))
                      } else {
                          d[g] = e
                      }
                  }
              } else {
                  d[g] = e
              }
          }
          return d
      },
      clone: function(d) {
          return a.merge(d, {})
      },
      getTickSize: function(h, g, d, e) {
          var l = (d - g) / h,
              k = a.getMagnitude(l),
              j = 10,
              f = l / k;
          if (f < 1.5) {
              j = 1
          } else {
              if (f < 2.25) {
                  j = 2
              } else {
                  if (f < 3) {
                      j = ((e === 0) ? 2 : 2.5)
                  } else {
                      if (f < 7.5) {
                          j = 5
                      }
                  }
              }
          }
          return j * k
      },
      defaultTickFormatter: function(e, d) {
          return e + ""
      },
      defaultTrackFormatter: function(d) {
          return "(" + d.x + ", " + d.y + ")"
      },
      engineeringNotation: function(h, d, g) {
          var f = ["Y", "Z", "E", "P", "T", "G", "M", "k", ""],
              j = ["y", "z", "a", "f", "p", "n", "µ", "m", ""],
              e = f.length;
          g = g || 1000;
          d = Math.pow(10, d || 2);
          if (h === 0) {
              return 0
          }
          if (h > 1) {
              while (e-- && (h >= g)) {
                  h /= g
              }
          } else {
              f = j;
              e = f.length;
              while (e-- && (h < 1)) {
                  h *= g
              }
          }
          return (Math.round(h * d) / d) + f[e]
      },
      getMagnitude: function(d) {
          return Math.pow(10, Math.floor(Math.log(d) / Math.LN10))
      },
      toPixel: function(d) {
          return Math.floor(d) + 0.5
      },
      toRad: function(d) {
          return -d * (Math.PI / 180)
      },
      floorInBase: function(e, d) {
          return d * Math.floor(e / d)
      },
      drawText: function(e, g, d, h, f) {
          if (!e.fillText) {
              e.drawText(g, d, h, f);
              return
          }
          f = this._.extend({
              size: a.defaultOptions.fontSize,
              color: "#000000",
              textAlign: "left",
              textBaseline: "bottom",
              weight: 1,
              angle: 0
          }, f);
          e.save();
          e.translate(d, h);
          e.rotate(f.angle);
          e.fillStyle = f.color;
          e.font = (f.weight > 1 ? "bold " : "") + (f.size * 1.3) + "px sans-serif";
          e.textAlign = f.textAlign;
          e.textBaseline = f.textBaseline;
          e.fillText(g, 0, 0);
          e.restore()
      },
      getBestTextAlign: function(e, d) {
          d = d || {
              textAlign: "center",
              textBaseline: "middle"
          };
          e += a.getTextAngleFromAlign(d);
          if (Math.abs(Math.cos(e)) > 0.01) {
              d.textAlign = (Math.cos(e) > 0 ? "right" : "left")
          }
          if (Math.abs(Math.sin(e)) > 0.01) {
              d.textBaseline = (Math.sin(e) > 0 ? "top" : "bottom")
          }
          return d
      },
      alignTable: {
          "right middle": 0,
          "right top": Math.PI / 4,
          "center top": Math.PI / 2,
          "left top": 3 * (Math.PI / 4),
          "left middle": Math.PI,
          "left bottom": -3 * (Math.PI / 4),
          "center bottom": -Math.PI / 2,
          "right bottom": -Math.PI / 4,
          "center middle": 0
      },
      getTextAngleFromAlign: function(d) {
          return a.alignTable[d.textAlign + " " + d.textBaseline] || 0
      },
      noConflict: function() {
          b.Flotr = c;
          return this
      }
  };
  b.Flotr = a
})();
Flotr.defaultOptions = {
  colors: ["#00A8F0", "#C0D800", "#CB4B4B", "#4DA74D", "#9440ED"],
  ieBackgroundColor: "#FFFFFF",
  title: null,
  subtitle: null,
  shadowSize: 4,
  defaultType: null,
  HtmlText: true,
  fontColor: "#545454",
  fontSize: 7.5,
  resolution: 1,
  parseFloat: true,
  xaxis: {
      ticks: null,
      minorTicks: null,
      showLabels: true,
      showMinorLabels: false,
      labelsAngle: 0,
      title: null,
      titleAngle: 0,
      noTicks: 5,
      minorTickFreq: null,
      tickFormatter: Flotr.defaultTickFormatter,
      tickDecimals: null,
      min: null,
      max: null,
      autoscale: false,
      autoscaleMargin: 0,
      color: null,
      mode: "normal",
      timeFormat: null,
      timeMode: "UTC",
      timeUnit: "millisecond",
      scaling: "linear",
      base: Math.E,
      titleAlign: "center",
      margin: true
  },
  x2axis: {},
  yaxis: {
      ticks: null,
      minorTicks: null,
      showLabels: true,
      showMinorLabels: false,
      labelsAngle: 0,
      title: null,
      titleAngle: 90,
      noTicks: 5,
      minorTickFreq: null,
      tickFormatter: Flotr.defaultTickFormatter,
      tickDecimals: null,
      min: null,
      max: null,
      autoscale: false,
      autoscaleMargin: 0,
      color: null,
      scaling: "linear",
      base: Math.E,
      titleAlign: "center",
      margin: true
  },
  y2axis: {
      titleAngle: 270
  },
  grid: {
      color: "#545454",
      backgroundColor: null,
      backgroundImage: null,
      watermarkAlpha: 0.4,
      tickColor: "#DDDDDD",
      labelMargin: 3,
      verticalLines: true,
      minorVerticalLines: null,
      horizontalLines: true,
      minorHorizontalLines: null,
      outlineWidth: 1,
      outline: "nsew",
      circular: false
  },
  mouse: {
      track: false,
      trackAll: false,
      position: "se",
      relative: false,
      trackFormatter: Flotr.defaultTrackFormatter,
      margin: 5,
      lineColor: "#FF3F19",
      trackDecimals: 1,
      sensibility: 2,
      trackY: true,
      radius: 3,
      fillColor: null,
      fillOpacity: 0.4
  }
};
(function() {
  var b = Flotr._;
  function c(j, h, e, f) {
      this.rgba = ["r", "g", "b", "a"];
      var d = 4;
      while (-1 < --d) {
          this[this.rgba[d]] = arguments[d] || ((d == 3) ? 1 : 0)
      }
      this.normalize()
  }
  var a = {
      aqua: [0, 255, 255],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      black: [0, 0, 0],
      blue: [0, 0, 255],
      brown: [165, 42, 42],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgrey: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkviolet: [148, 0, 211],
      fuchsia: [255, 0, 255],
      gold: [255, 215, 0],
      green: [0, 128, 0],
      indigo: [75, 0, 130],
      khaki: [240, 230, 140],
      lightblue: [173, 216, 230],
      lightcyan: [224, 255, 255],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      navy: [0, 0, 128],
      olive: [128, 128, 0],
      orange: [255, 165, 0],
      pink: [255, 192, 203],
      purple: [128, 0, 128],
      violet: [128, 0, 128],
      red: [255, 0, 0],
      silver: [192, 192, 192],
      white: [255, 255, 255],
      yellow: [255, 255, 0]
  };
  c.prototype = {
      scale: function(g, f, h, e) {
          var d = 4;
          while (-1 < --d) {
              if (!b.isUndefined(arguments[d])) {
                  this[this.rgba[d]] *= arguments[d]
              }
          }
          return this.normalize()
      },
      alpha: function(d) {
          if (!b.isUndefined(d) && !b.isNull(d)) {
              this.a = d
          }
          return this.normalize()
      },
      clone: function() {
          return new c(this.r, this.b, this.g, this.a)
      },
      limit: function(e, d, f) {
          return Math.max(Math.min(e, f), d)
      },
      normalize: function() {
          var d = this.limit;
          this.r = d(parseInt(this.r, 10), 0, 255);
          this.g = d(parseInt(this.g, 10), 0, 255);
          this.b = d(parseInt(this.b, 10), 0, 255);
          this.a = d(this.a, 0, 1);
          return this
      },
      distance: function(e) {
          if (!e) {
              return
          }
          e = new c.parse(e);
          var f = 0,
              d = 3;
          while (-1 < --d) {
              f += Math.abs(this[this.rgba[d]] - e[this.rgba[d]])
          }
          return f
      },
      toString: function() {
          return (this.a >= 1) ? "rgb(" + [this.r, this.g, this.b].join(",") + ")" : "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")"
      },
      contrast: function() {
          var d = 1 - (0.299 * this.r + 0.587 * this.g + 0.114 * this.b) / 255;
          return ( d < 0.5 ? "#000000" : "#ffffff")
      }
  };
  b.extend(c, {
      parse: function(e) {
          if (e instanceof c) {
              return e
          }
          var d;
          if ((d = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(e))) {
              return new c(parseInt(d[1], 16), parseInt(d[2], 16), parseInt(d[3], 16))
          }
          if ((d = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(e))) {
              return new c(parseInt(d[1], 10), parseInt(d[2], 10), parseInt(d[3], 10))
          }
          if ((d = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(e))) {
              return new c(parseInt(d[1] + d[1], 16), parseInt(d[2] + d[2], 16), parseInt(d[3] + d[3], 16))
          }
          if ((d = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(e))) {
              return new c(parseInt(d[1], 10), parseInt(d[2], 10), parseInt(d[3], 10), parseFloat(d[4]))
          }
          if ((d = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(e))) {
              return new c(parseFloat(d[1]) * 2.55, parseFloat(d[2]) * 2.55, parseFloat(d[3]) * 2.55)
          }
          if ((d = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(e))) {
              return new c(parseFloat(d[1]) * 2.55, parseFloat(d[2]) * 2.55, parseFloat(d[3]) * 2.55, parseFloat(d[4]))
          }
          var f = (e + "").replace(/^\s*([\S\s]*?)\s*$/, "$1").toLowerCase();
          if (f == "transparent") {
              return new c(255, 255, 255, 0)
          }
          return (d = a[f]) ? new c(d[0], d[1], d[2]) : new c(0, 0, 0, 0)
      },
      processColor: function(d, f) {
          var e = f.opacity;
          if (!d) {
              return "rgba(0, 0, 0, 0)"
          }
          if (d instanceof c) {
              return d.alpha(e).toString()
          }
          if (b.isString(d)) {
              return c.parse(d).alpha(e).toString()
          }
          var l = d.colors ? d : {
              colors: d
          };
          if (!f.ctx) {
              if (!b.isArray(l.colors)) {
                  return "rgba(0, 0, 0, 0)"
              }
              return c.parse(b.isArray(l.colors[0]) ? l.colors[0][1] : l.colors[0]).alpha(e).toString()
          }
          l = b.extend({
              start: "top",
              end: "bottom"
          }, l);
          if (/top/i.test(l.start)) {
              f.x1 = 0
          }
          if (/left/i.test(l.start)) {
              f.y1 = 0
          }
          if (/bottom/i.test(l.end)) {
              f.x2 = 0
          }
          if (/right/i.test(l.end)) {
              f.y2 = 0
          }
          var h,
              k,
              g,
              j = f.ctx.createLinearGradient(f.x1, f.y1, f.x2, f.y2);
          for (h = 0; h < l.colors.length; h++) {
              k = l.colors[h];
              if (b.isArray(k)) {
                  g = k[0];
                  k = k[1]
              } else {
                  g = h / (l.colors.length - 1)
              }
              j.addColorStop(g, c.parse(k).alpha(e))
          }
          return j
      }
  });
  Flotr.Color = c
})();
Flotr.Date = {
  set: function(b, a, d, c) {
      d = d || "UTC";
      a = "set" + (d === "UTC" ? "UTC" : "") + a;
      b[a](c)
  },
  get: function(b, a, c) {
      c = c || "UTC";
      a = "get" + (c === "UTC" ? "UTC" : "") + a;
      return b[a]()
  },
  format: function(g, k, f) {
      if (!g) {
          return
      }
      var b = this.get,
          j = {
              h: b(g, "Hours", f).toString(),
              H: l(b(g, "Hours", f)),
              M: l(b(g, "Minutes", f)),
              S: l(b(g, "Seconds", f)),
              s: b(g, "Milliseconds", f),
              d: b(g, "Date", f).toString(),
              m: (b(g, "Month") + 1).toString(),
              y: b(g, "FullYear").toString(),
              b: Flotr.Date.monthNames[b(g, "Month", f)]
          };
      function l(c) {
          c += "";
          return c.length == 1 ? "0" + c : c
      }
      var a = [],
          h,
          m = false;
      for (var e = 0; e < k.length; ++e) {
          h = k.charAt(e);
          if (m) {
              a.push(j[h] || h);
              m = false
          } else {
              if (h == "%") {
                  m = true
              } else {
                  a.push(h)
              }
          }
      }
      return a.join("")
  },
  getFormat: function(c, b) {
      var a = Flotr.Date.timeUnits;
      if (c < a.second) {
          return "%h:%M:%S.%s"
      } else {
          if (c < a.minute) {
              return "%h:%M:%S"
          } else {
              if (c < a.day) {
                  return (b < 2 * a.day) ? "%h:%M" : "%b %d %h:%M"
              } else {
                  if (c < a.month) {
                      return "%b %d"
                  } else {
                      if (c < a.year) {
                          return (b < a.year) ? "%b" : "%b %y"
                      } else {
                          return "%y"
                      }
                  }
              }
          }
      }
  },
  formatter: function(a, f) {
      var b = f.options,
          h = Flotr.Date.timeUnits[b.timeUnit],
          g = new Date(a * h);
      if (f.options.timeFormat) {
          return Flotr.Date.format(g, b.timeFormat, b.timeMode)
      }
      var e = (f.max - f.min) * h,
          c = f.tickSize * Flotr.Date.timeUnits[f.tickUnit];
      return Flotr.Date.format(g, Flotr.Date.getFormat(c, e), b.timeMode)
  },
  generator: function(b) {
      var l = this.set,
          A = this.get,
          j = this.timeUnits,
          h = this.spec,
          e = b.options,
          m = e.timeMode,
          D = j[e.timeUnit],
          r = b.min * D,
          t = b.max * D,
          B = (t - r) / e.noTicks,
          C = [],
          q = b.tickSize,
          o,
          s,
          u;
      s = (e.tickFormatter === Flotr.defaultTickFormatter ? this.formatter : e.tickFormatter);
      for (u = 0; u < h.length - 1; ++u) {
          var z = h[u][0] * j[h[u][1]];
          if (B < (z + h[u + 1][0] * j[h[u + 1][1]]) / 2 && z >= q) {
              break
          }
      }
      q = h[u][0];
      o = h[u][1];
      if (o == "year") {
          q = Flotr.getTickSize(e.noTicks * j.year, r, t, 0);
          if (q == 0.5) {
              o = "month";
              q = 6
          }
      }
      b.tickUnit = o;
      b.tickSize = q;
      var z = new Date(r);
      var g = q * j[o];
      function a(d) {
          l(z, d, m, Flotr.floorInBase(A(z, d, m), q))
      }
      switch (o) {
      case "millisecond":
          a("Milliseconds");
          break;
      case "second":
          a("Seconds");
          break;
      case "minute":
          a("Minutes");
          break;
      case "hour":
          a("Hours");
          break;
      case "month":
          a("Month");
          break;
      case "year":
          a("FullYear");
          break
      }
      if (g >= j.second) {
          l(z, "Milliseconds", m, 0)
      }
      if (g >= j.minute) {
          l(z, "Seconds", m, 0)
      }
      if (g >= j.hour) {
          l(z, "Minutes", m, 0)
      }
      if (g >= j.day) {
          l(z, "Hours", m, 0)
      }
      if (g >= j.day * 4) {
          l(z, "Date", m, 1)
      }
      if (g >= j.year) {
          l(z, "Month", m, 0)
      }
      var w = 0,
          k = NaN,
          p;
      do {
          p = k;
          k = z.getTime();
          C.push({
              v: k / D,
              label: s(k / D, b)
          });
          if (o == "month") {
              if (q < 1) {
                  l(z, "Date", m, 1);
                  var f = z.getTime();
                  l(z, "Month", m, A(z, "Month", m) + 1);
                  var c = z.getTime();
                  z.setTime(k + w * j.hour + (c - f) * q);
                  w = A(z, "Hours", m);
                  l(z, "Hours", m, 0)
              } else {
                  l(z, "Month", m, A(z, "Month", m) + q)
              }
          } else {
              if (o == "year") {
                  l(z, "FullYear", m, A(z, "FullYear", m) + q)
              } else {
                  z.setTime(k + g)
              }
          }
      } while (k < t && k != p);
      return C
  },
  timeUnits: {
      millisecond: 1,
      second: 1000,
      minute: 1000 * 60,
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
      month: 1000 * 60 * 60 * 24 * 30,
      year: 1000 * 60 * 60 * 24 * 365.2425
  },
  spec: [[1, "millisecond"], [20, "millisecond"], [50, "millisecond"], [100, "millisecond"], [200, "millisecond"], [500, "millisecond"], [1, "second"], [2, "second"], [5, "second"], [10, "second"], [30, "second"], [1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"], [30, "minute"], [1, "hour"], [2, "hour"], [4, "hour"], [8, "hour"], [12, "hour"], [1, "day"], [2, "day"], [3, "day"], [0.25, "month"], [0.5, "month"], [1, "month"], [2, "month"], [3, "month"], [6, "month"], [1, "year"]],
  monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};
(function() {
  var a = Flotr._;
  Flotr.DOM = {
      addClass: function(c, b) {
          var d = (c.className ? c.className : "");
          if (a.include(d.split(/\s+/g), b)) {
              return
          }
          c.className = (d ? d + " " : "") + b
      },
      create: function(b) {
          return document.createElement(b)
      },
      node: function(b) {
          var d = Flotr.DOM.create("div"),
              c;
          d.innerHTML = b;
          c = d.children[0];
          d.innerHTML = "";
          return c
      },
      empty: function(b) {
          b.innerHTML = ""
      },
      hide: function(b) {
          Flotr.DOM.setStyles(b, {
              display: "none"
          })
      },
      insert: function(b, c) {
          if (a.isString(c)) {
              b.innerHTML += c
          } else {
              if (a.isElement(c)) {
                  b.appendChild(c)
              }
          }
      },
      opacity: function(c, b) {
          c.style.opacity = b
      },
      position: function(b, c) {
          if (!b.offsetParent) {
              return {
                  left: (b.offsetLeft || 0),
                  top: (b.offsetTop || 0)
              }
          }
          c = this.position(b.offsetParent);
          c.left += b.offsetLeft;
          c.top += b.offsetTop;
          return c
      },
      removeClass: function(c, b) {
          var d = (c.className ? c.className : "");
          c.className = a.filter(d.split(/\s+/g), function(e) {
              if (e != b) {
                  return true
              }
          }).join(" ")
      },
      setStyles: function(b, c) {
          a.each(c, function(e, d) {
              b.style[d] = e
          })
      },
      show: function(b) {
          Flotr.DOM.setStyles(b, {
              display: ""
          })
      },
      size: function(b) {
          return {
              height: b.offsetHeight,
              width: b.offsetWidth
          }
      }
  }
})();
(function() {
  var b = Flotr,
      a = b.bean;
  b.EventAdapter = {
      observe: function(d, c, e) {
          a.add(d, c, e);
          return this
      },
      fire: function(e, d, c) {
          a.fire(e, d, c);
          if (typeof (Prototype) != "undefined") {
              Event.fire(e, d, c)
          }
          return this
      },
      stopObserving: function(d, c, e) {
          a.remove(d, c, e);
          return this
      },
      eventPointer: function(f) {
          if (!b._.isUndefined(f.touches) && f.touches.length > 0) {
              return {
                  x: f.touches[0].pageX,
                  y: f.touches[0].pageY
              }
          } else {
              if (!b._.isUndefined(f.changedTouches) && f.changedTouches.length > 0) {
                  return {
                      x: f.changedTouches[0].pageX,
                      y: f.changedTouches[0].pageY
                  }
              } else {
                  if (f.pageX || f.pageY) {
                      return {
                          x: f.pageX,
                          y: f.pageY
                      }
                  } else {
                      if (f.clientX || f.clientY) {
                          var g = document,
                              c = g.body,
                              h = g.documentElement;
                          return {
                              x: f.clientX + c.scrollLeft + h.scrollLeft,
                              y: f.clientY + c.scrollTop + h.scrollTop
                          }
                      }
                  }
              }
          }
      }
  }
})();
(function() {
  var c = Flotr,
      d = c.DOM,
      a = c._,
      b = function(e) {
          this.o = e
      };
  b.prototype = {
      dimensions: function(h, f, e, g) {
          if (!h) {
              return {
                  width: 0,
                  height: 0
              }
          }
          return (this.o.html) ? this.html(h, this.o.element, e, g) : this.canvas(h, f)
      },
      canvas: function(o, f) {
          if (!this.o.textEnabled) {
              return
          }
          f = f || {};
          var k = this.measureText(o, f),
              g = k.width,
              p = f.size || c.defaultOptions.fontSize,
              j = f.angle || 0,
              l = Math.cos(j),
              h = Math.sin(j),
              q = 2,
              m = 6,
              e;
          e = {
              width: Math.abs(l * g) + Math.abs(h * p) + q,
              height: Math.abs(h * g) + Math.abs(l * p) + m
          };
          return e
      },
      html: function(h, e, g, f) {
          var j = d.create("div");
          d.setStyles(j, {
              position: "absolute",
              top: "-10000px"
          });
          d.insert(j, '<div style="' + g + '" class="' + f + ' flotr-dummy-div">' + h + "</div>");
          d.insert(this.o.element, j);
          return d.size(j)
      },
      measureText: function(h, g) {
          var e = this.o.ctx,
              f;
          if (!e.fillText || (c.isIphone && e.measure)) {
              return {
                  width: e.measure(h, g)
              }
          }
          g = a.extend({
              size: c.defaultOptions.fontSize,
              weight: 1,
              angle: 0
          }, g);
          e.save();
          e.font = (g.weight > 1 ? "bold " : "") + (g.size * 1.3) + "px sans-serif";
          f = e.measureText(h);
          e.restore();
          return f
      }
  };
  Flotr.Text = b
})();
(function() {
  var e = Flotr.DOM,
      c = Flotr.EventAdapter,
      a = Flotr._,
      b = Flotr;
  Graph = function(g, h, f) {
      this._setEl(g);
      this._initMembers();
      this._initPlugins();
      c.fire(this.el, "flotr:beforeinit", [this]);
      this.data = h;
      this.series = b.Series.getSeries(h);
      this._initOptions(f);
      this._initGraphTypes();
      this._initCanvas();
      this._text = new b.Text({
          element: this.el,
          ctx: this.ctx,
          html: this.options.HtmlText,
          textEnabled: this.textEnabled
      });
      c.fire(this.el, "flotr:afterconstruct", [this]);
      this._initEvents();
      this.findDataRanges();
      this.calculateSpacing();
      this.draw(a.bind(function() {
          c.fire(this.el, "flotr:afterinit", [this])
      }, this))
  };
  function d(g, f, h) {
      c.observe.apply(this, arguments);
      this._handles.push(arguments);
      return this
  }
  Graph.prototype = {
      destroy: function() {
          c.fire(this.el, "flotr:destroy");
          a.each(this._handles, function(f) {
              c.stopObserving.apply(this, f)
          });
          this._handles = [];
          this.el.graph = null
      },
      observe: d,
      _observe: d,
      processColor: function(f, g) {
          var h = {
              x1: 0,
              y1: 0,
              x2: this.plotWidth,
              y2: this.plotHeight,
              opacity: 1,
              ctx: this.ctx
          };
          a.extend(h, g);
          return b.Color.processColor(f, h)
      },
      findDataRanges: function() {
          var f = this.axes,
              l,
              j,
              g;
          a.each(this.series, function(m) {
              g = m.getRange();
              if (g) {
                  l = m.xaxis;
                  j = m.yaxis;
                  l.datamin = Math.min(g.xmin, l.datamin);
                  l.datamax = Math.max(g.xmax, l.datamax);
                  j.datamin = Math.min(g.ymin, j.datamin);
                  j.datamax = Math.max(g.ymax, j.datamax);
                  l.used = (l.used || g.xused);
                  j.used = (j.used || g.yused)
              }
          }, this);
          if (!f.x.used && !f.x2.used) {
              f.x.used = true
          }
          if (!f.y.used && !f.y2.used) {
              f.y.used = true
          }
          a.each(f, function(m) {
              m.calculateRange()
          });
          var h = a.keys(b.graphTypes),
              k = false;
          a.each(this.series, function(m) {
              if (m.hide) {
                  return
              }
              a.each(h, function(o) {
                  if (m[o] && m[o].show) {
                      this.extendRange(o, m);
                      k = true
                  }
              }, this);
              if (!k) {
                  this.extendRange(this.options.defaultType, m)
              }
          }, this)
      },
      extendRange: function(g, f) {
          if (this[g].extendRange) {
              this[g].extendRange(f, f.data, f[g], this[g])
          }
          if (this[g].extendYRange) {
              this[g].extendYRange(f.yaxis, f.data, f[g], this[g])
          }
          if (this[g].extendXRange) {
              this[g].extendXRange(f.xaxis, f.data, f[g], this[g])
          }
      },
      calculateSpacing: function() {
          var w = this.axes,
              A = this.options,
              s = this.series,
              k = A.grid.labelMargin,
              m = this._text,
              z = w.x,
              f = w.x2,
              v = w.y,
              u = w.y2,
              q = A.grid.outlineWidth,
              r,
              o,
              h,
              t;
          a.each(w, function(j) {
              j.calculateTicks();
              j.calculateTextDimensions(m, A)
          });
          t = m.dimensions(A.title, {
              size: A.fontSize * 1.5
          }, "font-size:1em;font-weight:bold;", "flotr-title");
          this.titleHeight = t.height;
          t = m.dimensions(A.subtitle, {
              size: A.fontSize
          }, "font-size:smaller;", "flotr-subtitle");
          this.subtitleHeight = t.height;
          for (o = 0; o < A.length; ++o) {
              if (s[o].points.show) {
                  q = Math.max(q, s[o].points.radius + s[o].points.lineWidth / 2)
              }
          }
          var g = this.plotOffset;
          if (z.options.margin === false) {
              g.bottom = 0;
              g.top = 0
          } else {
              g.bottom += (A.grid.circular ? 0 : (z.used && z.options.showLabels ? (z.maxLabel.height + k) : 0)) + (z.used && z.options.title ? (z.titleSize.height + k) : 0) + q;
              g.top += (A.grid.circular ? 0 : (f.used && f.options.showLabels ? (f.maxLabel.height + k) : 0)) + (f.used && f.options.title ? (f.titleSize.height + k) : 0) + this.subtitleHeight + this.titleHeight + q
          }
          if (v.options.margin === false) {
              g.left = 0;
              g.right = 0
          } else {
              g.left += (A.grid.circular ? 0 : (v.used && v.options.showLabels ? (v.maxLabel.width + k) : 0)) + (v.used && v.options.title ? (v.titleSize.width + k) : 0) + q;
              g.right += (A.grid.circular ? 0 : (u.used && u.options.showLabels ? (u.maxLabel.width + k) : 0)) + (u.used && u.options.title ? (u.titleSize.width + k) : 0) + q
          }
          g.top = Math.floor(g.top);
          this.plotWidth = this.canvasWidth - g.left - g.right;
          this.plotHeight = this.canvasHeight - g.bottom - g.top;
          z.length = f.length = this.plotWidth;
          v.length = u.length = this.plotHeight;
          v.offset = u.offset = this.plotHeight;
          z.setScale();
          f.setScale();
          v.setScale();
          u.setScale()
      },
      draw: function(h) {
          var g = this.ctx,
              f;
          c.fire(this.el, "flotr:beforedraw", [this.series, this]);
          if (this.series.length) {
              g.save();
              g.translate(this.plotOffset.left, this.plotOffset.top);
              for (f = 0; f < this.series.length; f++) {
                  if (!this.series[f].hide) {
                      this.drawSeries(this.series[f])
                  }
              }
              g.restore();
              this.clip()
          }
          c.fire(this.el, "flotr:afterdraw", [this.series, this]);
          if (h) {
              h()
          }
      },
      drawSeries: function(g) {
          function f(k, l) {
              var j = this.getOptions(k, l);
              this[l].draw(j)
          }
          var h = false;
          g = g || this.series;
          a.each(b.graphTypes, function(j, k) {
              if (g[k] && g[k].show && this[k]) {
                  h = true;
                  f.call(this, g, k)
              }
          }, this);
          if (!h) {
              f.call(this, g, this.options.defaultType)
          }
      },
      getOptions: function(g, k) {
          var h = g[k],
              j = this[k],
              f = {
                  context: this.ctx,
                  width: this.plotWidth,
                  height: this.plotHeight,
                  fontSize: this.options.fontSize,
                  fontColor: this.options.fontColor,
                  textEnabled: this.textEnabled,
                  htmlText: this.options.HtmlText,
                  text: this._text,
                  element: this.el,
                  data: g.data,
                  color: g.color,
                  shadowSize: g.shadowSize,
                  xScale: a.bind(g.xaxis.d2p, g.xaxis),
                  yScale: a.bind(g.yaxis.d2p, g.yaxis)
              };
          f = b.merge(h, f);
          f.fillStyle = this.processColor(h.fillColor || g.color, {
              opacity: h.fillOpacity
          });
          return f
      },
      getEventPosition: function(m) {
          var o = document,
              q = o.body,
              s = o.documentElement,
              p = this.axes,
              k = this.plotOffset,
              l = this.lastMousePos,
              g = c.eventPointer(m),
              u = g.x - l.pageX,
              t = g.y - l.pageY,
              f,
              j,
              h;
          if ("ontouchstart" in this.el) {
              f = e.position(this.overlay);
              j = g.x - f.left - k.left;
              h = g.y - f.top - k.top
          } else {
              f = this.overlay.getBoundingClientRect();
              j = m.clientX - f.left - k.left - q.scrollLeft - s.scrollLeft;
              h = m.clientY - f.top - k.top - q.scrollTop - s.scrollTop
          }
          return {
              x: p.x.p2d(j),
              x2: p.x2.p2d(j),
              y: p.y.p2d(h),
              y2: p.y2.p2d(h),
              relX: j,
              relY: h,
              dX: u,
              dY: t,
              absX: g.x,
              absY: g.y,
              pageX: g.x,
              pageY: g.y
          }
      },
      clickHandler: function(f) {
          if (this.ignoreClick) {
              this.ignoreClick = false;
              return this.ignoreClick
          }
          c.fire(this.el, "flotr:click", [this.getEventPosition(f), this])
      },
      mouseMoveHandler: function(f) {
          if (this.mouseDownMoveHandler) {
              return
          }
          var g = this.getEventPosition(f);
          c.fire(this.el, "flotr:mousemove", [f, g, this]);
          this.lastMousePos = g
      },
      mouseDownHandler: function(f) {
          if (this.mouseUpHandler) {
              return
          }
          this.mouseUpHandler = a.bind(function(g) {
              c.stopObserving(document, "mouseup", this.mouseUpHandler);
              c.stopObserving(document, "mousemove", this.mouseDownMoveHandler);
              this.mouseDownMoveHandler = null;
              this.mouseUpHandler = null;
              c.fire(this.el, "flotr:mouseup", [g, this])
          }, this);
          this.mouseDownMoveHandler = a.bind(function(g) {
              var h = this.getEventPosition(g);
              c.fire(this.el, "flotr:mousemove", [f, h, this]);
              this.lastMousePos = h
          }, this);
          c.observe(document, "mouseup", this.mouseUpHandler);
          c.observe(document, "mousemove", this.mouseDownMoveHandler);
          c.fire(this.el, "flotr:mousedown", [f, this]);
          this.ignoreClick = false
      },
      drawTooltip: function(l, q, o, r) {
          var f = this.getMouseTrack(),
              g = "opacity:0.7;background-color:#000;color:#fff;display:none;position:absolute;padding:2px 8px;-moz-border-radius:4px;border-radius:4px;white-space:nowrap;",
              h = r.position,
              k = r.margin,
              j = this.plotOffset;
          if (q !== null && o !== null) {
              if (!r.relative) {
                  if (h.charAt(0) == "n") {
                      g += "top:" + (k + j.top) + "px;bottom:auto;"
                  } else {
                      if (h.charAt(0) == "s") {
                          g += "bottom:" + (k + j.bottom) + "px;top:auto;"
                      }
                  }
                  if (h.charAt(1) == "e") {
                      g += "right:" + (k + j.right) + "px;left:auto;"
                  } else {
                      if (h.charAt(1) == "w") {
                          g += "left:" + (k + j.left) + "px;right:auto;"
                      }
                  }
              } else {
                  if (h.charAt(0) == "n") {
                      g += "bottom:" + (k - j.top - o + this.canvasHeight) + "px;top:auto;"
                  } else {
                      if (h.charAt(0) == "s") {
                          g += "top:" + (k + j.top + o) + "px;bottom:auto;"
                      }
                  }
                  if (h.charAt(1) == "e") {
                      g += "left:" + (k + j.left + q) + "px;right:auto;"
                  } else {
                      if (h.charAt(1) == "w") {
                          g += "right:" + (k - j.left - q + this.canvasWidth) + "px;left:auto;"
                      }
                  }
              }
              f.style.cssText = g;
              e.empty(f);
              e.insert(f, l);
              e.show(f)
          } else {
              e.hide(f)
          }
      },
      clip: function(g) {
          var k = this.plotOffset,
              f = this.canvasWidth,
              j = this.canvasHeight;
          g = g || this.ctx;
          if (b.isIE && b.isIE < 9) {
              g.save();
              g.fillStyle = this.processColor(this.options.ieBackgroundColor);
              g.fillRect(0, 0, f, k.top);
              g.fillRect(0, 0, k.left, j);
              g.fillRect(0, j - k.bottom, f, k.bottom);
              g.fillRect(f - k.right, 0, k.right, j);
              g.restore()
          } else {
              g.clearRect(0, 0, f, k.top);
              g.clearRect(0, 0, k.left, j);
              g.clearRect(0, j - k.bottom, f, k.bottom);
              g.clearRect(f - k.right, 0, k.right, j)
          }
      },
      _initMembers: function() {
          this._handles = [];
          this.lastMousePos = {
              pageX: null,
              pageY: null
          };
          this.plotOffset = {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
          };
          this.ignoreClick = true;
          this.prevHit = null
      },
      _initGraphTypes: function() {
          a.each(b.graphTypes, function(f, g) {
              this[g] = b.clone(f)
          }, this)
      },
      _initEvents: function() {
          var g = this.el,
              j,
              f,
              h;
          if ("ontouchstart" in g) {
              j = a.bind(function(k) {
                  h = true;
                  c.stopObserving(document, "touchend", j);
                  c.fire(g, "flotr:mouseup", [event, this]);
                  this.multitouches = null;
                  if (!f) {
                      this.clickHandler(k)
                  }
              }, this);
              this.observe(this.overlay, "touchstart", a.bind(function(k) {
                  f = false;
                  h = false;
                  this.ignoreClick = false;
                  if (k.touches && k.touches.length > 1) {
                      this.multitouches = k.touches
                  }
                  c.fire(g, "flotr:mousedown", [event, this]);
                  this.observe(document, "touchend", j)
              }, this));
              this.observe(this.overlay, "touchmove", a.bind(function(k) {
                  var l = this.getEventPosition(k);
                  k.preventDefault();
                  f = true;
                  if (this.multitouches || (k.touches && k.touches.length > 1)) {
                      this.multitouches = k.touches
                  } else {
                      if (!h) {
                          c.fire(g, "flotr:mousemove", [event, l, this])
                      }
                  }
                  this.lastMousePos = l
              }, this))
          } else {
              this.observe(this.overlay, "mousedown", a.bind(this.mouseDownHandler, this)).observe(g, "mousemove", a.bind(this.mouseMoveHandler, this)).observe(this.overlay, "click", a.bind(this.clickHandler, this)).observe(g, "mouseout", function() {
                  c.fire(g, "flotr:mouseout")
              })
          }
      },
      _initCanvas: function() {
          var j = this.el,
              h = this.options,
              k = j.children,
              q = [],
              g,
              l,
              r,
              f;
          for (l = k.length; l--;) {
              g = k[l];
              if (!this.canvas && g.className === "flotr-canvas") {
                  this.canvas = g
              } else {
                  if (!this.overlay && g.className === "flotr-overlay") {
                      this.overlay = g
                  } else {
                      q.push(g)
                  }
              }
          }
          for (l = q.length; l--;) {
              j.removeChild(q[l])
          }
          e.setStyles(j, {
              position: "relative"
          });
          r = {};
          r.width = j.clientWidth;
          r.height = j.clientHeight;
          if (r.width <= 0 || r.height <= 0 || h.resolution <= 0) {
              throw "Invalid dimensions for plot, width = " + r.width + ", height = " + r.height + ", resolution = " + h.resolution
          }
          this.canvas = m(this.canvas, "canvas");
          this.overlay = m(this.overlay, "overlay");
          this.ctx = p(this.canvas);
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.octx = p(this.overlay);
          this.octx.clearRect(0, 0, this.overlay.width, this.overlay.height);
          this.canvasHeight = r.height;
          this.canvasWidth = r.width;
          this.textEnabled = !!this.ctx.drawText || !!this.ctx.fillText;
          function m(s, o) {
              if (!s) {
                  s = e.create("canvas");
                  if (typeof FlashCanvas != "undefined" && typeof s.getContext === "function") {
                      FlashCanvas.initElement(s)
                  }
                  s.className = "flotr-" + o;
                  s.style.cssText = "position:absolute;left:0px;top:0px;";
                  e.insert(j, s)
              }
              a.each(r, function(t, u) {
                  e.show(s);
                  if (o == "canvas" && s.getAttribute(u) === t) {
                      return
                  }
                  s.setAttribute(u, t * h.resolution);
                  s.style[u] = t + "px"
              });
              s.context_ = null;
              return s
          }
          function p(o) {
              if (window.G_vmlCanvasManager) {
                  window.G_vmlCanvasManager.initElement(o)
              }
              var s = o.getContext("2d");
              if (!window.G_vmlCanvasManager) {
                  s.scale(h.resolution, h.resolution)
              }
              return s
          }
      },
      _initPlugins: function() {
          a.each(b.plugins, function(g, f) {
              a.each(g.callbacks, function(h, j) {
                  this.observe(this.el, j, a.bind(h, this))
              }, this);
              this[f] = b.clone(g);
              a.each(this[f], function(h, j) {
                  if (a.isFunction(h)) {
                      this[f][j] = a.bind(h, this)
                  }
              }, this)
          }, this)
      },
      _initOptions: function(g) {
          var B = b.clone(b.defaultOptions);
          B.x2axis = a.extend(a.clone(B.xaxis), B.x2axis);
          B.y2axis = a.extend(a.clone(B.yaxis), B.y2axis);
          this.options = b.merge(g || {}, B);
          if (this.options.grid.minorVerticalLines === null && this.options.xaxis.scaling === "logarithmic") {
              this.options.grid.minorVerticalLines = true
          }
          if (this.options.grid.minorHorizontalLines === null && this.options.yaxis.scaling === "logarithmic") {
              this.options.grid.minorHorizontalLines = true
          }
          c.fire(this.el, "flotr:afterinitoptions", [this]);
          this.axes = b.Axis.getAxes(this.options);
          var o = [],
              h = [],
              r = this.series.length,
              w = this.series.length,
              k = this.options.colors,
              f = [],
              m = 0,
              v,
              q,
              p,
              A;
          for (q = w - 1; q > -1; --q) {
              v = this.series[q].color;
              if (v) {
                  --w;
                  if (a.isNumber(v)) {
                      o.push(v)
                  } else {
                      f.push(b.Color.parse(v))
                  }
              }
          }
          for (q = o.length - 1; q > -1; --q) {
              w = Math.max(w, o[q] + 1)
          }
          for (q = 0; h.length < w;) {
              v = (k.length == q) ? new b.Color(100, 100, 100) : b.Color.parse(k[q]);
              var l = m % 2 == 1 ? -1 : 1,
                  u = 1 + l * Math.ceil(m / 2) * 0.2;
              v.scale(u, u, u);
              h.push(v);
              if (++q >= k.length) {
                  q = 0;
                  ++m
              }
          }
          for (q = 0, p = 0; q < r; ++q) {
              A = this.series[q];
              if (!A.color) {
                  A.color = h[p++].toString()
              } else {
                  if (a.isNumber(A.color)) {
                      A.color = h[A.color].toString()
                  }
              }
              if (!A.xaxis) {
                  A.xaxis = this.axes.x
              }
              if (A.xaxis == 1) {
                  A.xaxis = this.axes.x
              } else {
                  if (A.xaxis == 2) {
                      A.xaxis = this.axes.x2
                  }
              }
              if (!A.yaxis) {
                  A.yaxis = this.axes.y
              }
              if (A.yaxis == 1) {
                  A.yaxis = this.axes.y
              } else {
                  if (A.yaxis == 2) {
                      A.yaxis = this.axes.y2
                  }
              }
              for (var z in b.graphTypes) {
                  A[z] = a.extend(a.clone(this.options[z]), A[z])
              }
              A.mouse = a.extend(a.clone(this.options.mouse), A.mouse);
              if (a.isUndefined(A.shadowSize)) {
                  A.shadowSize = this.options.shadowSize
              }
          }
      },
      _setEl: function(f) {
          if (!f) {
              throw "The target container doesn't exist"
          } else {
              if (f.graph instanceof Graph) {
                  f.graph.destroy()
              } else {
                  if (!f.clientWidth) {
                      throw "The target container must be visible"
                  }
              }
          }
          f.graph = this;
          this.el = f
      }
  };
  Flotr.Graph = Graph
})();
(function() {
  var h = Flotr._,
      j = "logarithmic";
  function f(k) {
      this.orientation = 1;
      this.offset = 0;
      this.datamin = Number.MAX_VALUE;
      this.datamax = -Number.MAX_VALUE;
      h.extend(this, k);
      this._setTranslations()
  }
  f.prototype = {
      setScale: function() {
          var k = this.length;
          if (this.options.scaling == j) {
              this.scale = k / (c(this.max, this.options.base) - c(this.min, this.options.base))
          } else {
              this.scale = k / (this.max - this.min)
          }
      },
      calculateTicks: function() {
          var k = this.options;
          this.ticks = [];
          this.minorTicks = [];
          if (k.ticks) {
              this._cleanUserTicks(k.ticks, this.ticks);
              this._cleanUserTicks(k.minorTicks || [], this.minorTicks)
          } else {
              if (k.mode == "time") {
                  this._calculateTimeTicks()
              } else {
                  if (k.scaling === "logarithmic") {
                      this._calculateLogTicks()
                  } else {
                      this._calculateTicks()
                  }
              }
          }
          h.each(this.ticks, function(l) {
              l.label += ""
          });
          h.each(this.minorTicks, function(l) {
              l.label += ""
          })
      },
      calculateRange: function() {
          if (!this.used) {
              return
          }
          var r = this,
              t = r.options,
              q = t.min !== null ? t.min : r.datamin,
              k = t.max !== null ? t.max : r.datamax,
              s = t.autoscaleMargin;
          if (t.scaling == "logarithmic") {
              if (q <= 0) {
                  q = r.datamin
              }
              if (k <= 0) {
                  k = q
              }
          }
          if (k == q) {
              var l = k ? 0.01 : 1;
              if (t.min === null) {
                  q -= l
              }
              if (t.max === null) {
                  k += l
              }
          }
          if (t.scaling === "logarithmic") {
              if (q < 0) {
                  q = k / t.base
              }
              var m = Math.log(k);
              if (t.base != Math.E) {
                  m /= Math.log(t.base)
              }
              m = Math.ceil(m);
              var p = Math.log(q);
              if (t.base != Math.E) {
                  p /= Math.log(t.base)
              }
              p = Math.ceil(p);
              r.tickSize = Flotr.getTickSize(t.noTicks, p, m, t.tickDecimals === null ? 0 : t.tickDecimals);
              if (t.minorTickFreq === null) {
                  if (m - p > 10) {
                      t.minorTickFreq = 0
                  } else {
                      if (m - p > 5) {
                          t.minorTickFreq = 2
                      } else {
                          t.minorTickFreq = 5
                      }
                  }
              }
          } else {
              r.tickSize = Flotr.getTickSize(t.noTicks, q, k, t.tickDecimals)
          }
          r.min = q;
          r.max = k;
          if (t.min === null && t.autoscale) {
              r.min -= r.tickSize * s;
              if (r.min < 0 && r.datamin >= 0) {
                  r.min = 0
              }
              r.min = r.tickSize * Math.floor(r.min / r.tickSize)
          }
          if (t.max === null && t.autoscale) {
              r.max += r.tickSize * s;
              if (r.max > 0 && r.datamax <= 0 && r.datamax != r.datamin) {
                  r.max = 0
              }
              r.max = r.tickSize * Math.ceil(r.max / r.tickSize)
          }
          if (r.min == r.max) {
              r.max = r.min + 1
          }
      },
      calculateTextDimensions: function(l, k) {
          var o = "",
              p,
              m;
          if (this.options.showLabels) {
              for (m = 0; m < this.ticks.length; ++m) {
                  p = this.ticks[m].label.length;
                  if (p > o.length) {
                      o = this.ticks[m].label
                  }
              }
          }
          this.maxLabel = l.dimensions(o, {
              size: k.fontSize,
              angle: Flotr.toRad(this.options.labelsAngle)
          }, "font-size:smaller;", "flotr-grid-label");
          this.titleSize = l.dimensions(this.options.title, {
              size: k.fontSize * 1.2,
              angle: Flotr.toRad(this.options.titleAngle)
          }, "font-weight:bold;", "flotr-axis-title")
      },
      _cleanUserTicks: function(r, s) {
          var q = this,
              m = this.options,
              k,
              p,
              l,
              o;
          if (h.isFunction(r)) {
              r = r({
                  min: q.min,
                  max: q.max
              })
          }
          for (p = 0; p < r.length; ++p) {
              o = r[p];
              if (typeof (o) === "object") {
                  k = o[0];
                  l = (o.length > 1) ? o[1] : m.tickFormatter(k, {
                      min: q.min,
                      max: q.max
                  })
              } else {
                  k = o;
                  l = m.tickFormatter(k, {
                      min: this.min,
                      max: this.max
                  })
              }
              s[p] = {
                  v: k,
                  label: l
              }
          }
      },
      _calculateTimeTicks: function() {
          this.ticks = Flotr.Date.generator(this)
      },
      _calculateLogTicks: function() {
          var r = this,
              s = r.options,
              m,
              q;
          var l = Math.log(r.max);
          if (s.base != Math.E) {
              l /= Math.log(s.base)
          }
          l = Math.ceil(l);
          var p = Math.log(r.min);
          if (s.base != Math.E) {
              p /= Math.log(s.base)
          }
          p = Math.ceil(p);
          for (i = p; i < l; i += r.tickSize) {
              q = (s.base == Math.E) ? Math.exp(i) : Math.pow(s.base, i);
              var t = q * ((s.base == Math.E) ? Math.exp(r.tickSize) : Math.pow(s.base, r.tickSize));
              var k = (t - q) / s.minorTickFreq;
              r.ticks.push({
                  v: q,
                  label: s.tickFormatter(q, {
                      min: r.min,
                      max: r.max
                  })
              });
              for (m = q + k; m < t; m += k) {
                  r.minorTicks.push({
                      v: m,
                      label: s.tickFormatter(m, {
                          min: r.min,
                          max: r.max
                      })
                  })
              }
          }
          q = (s.base == Math.E) ? Math.exp(i) : Math.pow(s.base, i);
          r.ticks.push({
              v: q,
              label: s.tickFormatter(q, {
                  min: r.min,
                  max: r.max
              })
          })
      },
      _calculateTicks: function() {
          var p = this,
              l = p.options,
              t = p.tickSize,
              r = p.min,
              w = p.max,
              k = t * Math.ceil(r / t),
              m,
              u,
              A,
              z,
              s,
              q;
          if (l.minorTickFreq) {
              u = t / l.minorTickFreq
          }
          for (s = 0; (A = z = k + s * t) <= w; ++s) {
              m = l.tickDecimals;
              if (m === null) {
                  m = 1 - Math.floor(Math.log(t) / Math.LN10)
              }
              if (m < 0) {
                  m = 0
              }
              A = A.toFixed(m);
              p.ticks.push({
                  v: A,
                  label: l.tickFormatter(A, {
                      min: p.min,
                      max: p.max
                  })
              });
              if (l.minorTickFreq) {
                  for (q = 0; q < l.minorTickFreq && (s * t + q * u) < w; ++q) {
                      A = z + q * u;
                      p.minorTicks.push({
                          v: A,
                          label: l.tickFormatter(A, {
                              min: p.min,
                              max: p.max
                          })
                      })
                  }
              }
          }
      },
      _setTranslations: function(k) {
          this.d2p = (k ? e : d);
          this.p2d = (k ? b : g)
      }
  };
  h.extend(f, {
      getAxes: function(k) {
          return {
              x: new f({
                  options: k.xaxis,
                  n: 1,
                  length: this.plotWidth
              }),
              x2: new f({
                  options: k.x2axis,
                  n: 2,
                  length: this.plotWidth
              }),
              y: new f({
                  options: k.yaxis,
                  n: 1,
                  length: this.plotHeight,
                  offset: this.plotHeight,
                  orientation: -1
              }),
              y2: new f({
                  options: k.y2axis,
                  n: 2,
                  length: this.plotHeight,
                  offset: this.plotHeight,
                  orientation: -1
              })
          }
      }
  });
  function d(k) {
      return this.offset + this.orientation * (k - this.min) * this.scale
  }
  function g(k) {
      return (this.offset + this.orientation * k) / this.scale + this.min
  }
  function e(k) {
      return this.offset + this.orientation * (c(k, this.options.base) - c(this.min, this.options.base)) * this.scale
  }
  function b(k) {
      return a((this.offset + this.orientation * k) / this.scale + c(this.min, this.options.base), this.options.base)
  }
  function c(l, k) {
      l = Math.log(Math.max(l, Number.MIN_VALUE));
      if (k !== Math.E) {
          l /= Math.log(k)
      }
      return l
  }
  function a(l, k) {
      return (k === Math.E) ? Math.exp(l) : Math.pow(k, l)
  }
  Flotr.Axis = f
})();
(function() {
  var b = Flotr._;
  function a(c) {
      b.extend(this, c)
  }
  a.prototype = {
      getRange: function() {
          var g = this.data,
              d = g.length,
              c = Number.MAX_VALUE,
              o = Number.MAX_VALUE,
              h = -Number.MAX_VALUE,
              e = -Number.MAX_VALUE,
              k = false,
              j = false,
              m,
              l,
              f;
          if (d < 0 || this.hide) {
              return false
          }
          for (f = 0; f < d; f++) {
              m = g[f][0];
              l = g[f][1];
              if (m < c) {
                  c = m;
                  k = true
              }
              if (m > h) {
                  h = m;
                  k = true
              }
              if (l < o) {
                  o = l;
                  j = true
              }
              if (l > e) {
                  e = l;
                  j = true
              }
          }
          return {
              xmin: c,
              xmax: h,
              ymin: o,
              ymax: e,
              xused: k,
              yused: j
          }
      }
  };
  b.extend(a, {
      getSeries: function(c) {
          return b.map(c, function(e) {
              var d;
              if (e.data) {
                  d = new a();
                  b.extend(d, e)
              } else {
                  d = new a({
                      data: e
                  })
              }
              return d
          })
      }
  });
  Flotr.Series = a
})();
Flotr.addType("lines", {
  options: {
      show: false,
      lineWidth: 2,
      fill: false,
      fillBorder: false,
      fillColor: null,
      fillOpacity: 0.4,
      steps: false,
      stacked: false
  },
  stack: {
      values: []
  },
  draw: function(b) {
      var c = b.context,
          a = b.lineWidth,
          d = b.shadowSize,
          e;
      c.save();
      c.lineJoin = "round";
      if (d) {
          c.lineWidth = d / 2;
          e = a / 2 + c.lineWidth / 2;
          c.strokeStyle = "rgba(0,0,0,0.1)";
          this.plot(b, e + d / 2, false);
          c.strokeStyle = "rgba(0,0,0,0.2)";
          this.plot(b, e, false)
      }
      c.lineWidth = a;
      c.strokeStyle = b.color;
      this.plot(b, 0, true);
      c.restore()
  },
  plot: function(e, l, w) {
      var c = e.context,
          r = e.width,
          q = e.height,
          A = e.xScale,
          b = e.yScale,
          z = e.data,
          k = e.stacked ? this.stack : false,
          f = z.length - 1,
          p = null,
          o = null,
          m = b(0),
          g = null,
          v,
          u,
          d,
          a,
          j,
          h,
          t;
      if (f < 1) {
          return
      }
      c.beginPath();
      for (t = 0; t < f; ++t) {
          if (z[t][1] === null || z[t + 1][1] === null) {
              if (e.fill) {
                  if (t > 0 && z[t][1]) {
                      c.stroke();
                      s();
                      g = null;
                      c.closePath();
                      c.beginPath()
                  }
              }
              continue
          }
          v = A(z[t][0]);
          u = A(z[t + 1][0]);
          if (g === null) {
              g = z[t]
          }
          if (k) {
              j = k.values[z[t][0]] || 0;
              h = k.values[z[t + 1][0]] || k.values[z[t][0]] || 0;
              d = b(z[t][1] + j);
              a = b(z[t + 1][1] + h);
              if (w) {
                  k.values[z[t][0]] = z[t][1] + j;
                  if (t == f - 1) {
                      k.values[z[t + 1][0]] = z[t + 1][1] + h
                  }
              }
          } else {
              d = b(z[t][1]);
              a = b(z[t + 1][1])
          }
          if ((d > q && a > q) || (d < 0 && a < 0) || (v < 0 && u < 0) || (v > r && u > r)) {
              continue
          }
          if ((p != v) || (o != d + l)) {
              c.moveTo(v, d + l)
          }
          p = u;
          o = a + l;
          if (e.steps) {
              c.lineTo(p + l / 2, d + l);
              c.lineTo(p + l / 2, o)
          } else {
              c.lineTo(p, o)
          }
      }
      if (!e.fill || e.fill && !e.fillBorder) {
          c.stroke()
      }
      s();
      function s() {
          if (!l && e.fill && g) {
              v = A(g[0]);
              c.fillStyle = e.fillStyle;
              c.lineTo(u, m);
              c.lineTo(v, m);
              c.lineTo(v, b(g[1]));
              c.fill();
              if (e.fillBorder) {
                  c.stroke()
              }
          }
      }
      c.closePath()
  },
  extendYRange: function(b, f, l, m) {
      var a = b.options;
      if (l.stacked && ((!a.max && a.max !== 0) || (!a.min && a.min !== 0))) {
          var g = b.max,
              d = b.min,
              c = m.positiveSums || {},
              h = m.negativeSums || {},
              k,
              e;
          for (e = 0; e < f.length; e++) {
              k = f[e][0] + "";
              if (f[e][1] > 0) {
                  c[k] = (c[k] || 0) + f[e][1];
                  g = Math.max(g, c[k])
              } else {
                  h[k] = (h[k] || 0) + f[e][1];
                  d = Math.min(d, h[k])
              }
          }
          m.negativeSums = h;
          m.positiveSums = c;
          b.max = g;
          b.min = d
      }
      if (l.steps) {
          this.hit = function(w) {
              var r = w.data,
                  t = w.args,
                  j = w.yScale,
                  s = t[0],
                  o = r.length,
                  p = t[1],
                  v = s.x,
                  u = s.relY,
                  q;
              for (q = 0; q < o - 1; q++) {
                  if (v >= r[q][0] && v <= r[q + 1][0]) {
                      if (Math.abs(j(r[q][1]) - u) < 8) {
                          p.x = r[q][0];
                          p.y = r[q][1];
                          p.index = q;
                          p.seriesIndex = w.index
                      }
                      break
                  }
              }
          };
          this.drawHit = function(v) {
              var o = v.context,
                  r = v.args,
                  p = v.data,
                  u = v.xScale,
                  q = r.index,
                  t = u(r.x),
                  s = v.yScale(r.y),
                  j;
              if (p.length - 1 > q) {
                  j = v.xScale(p[q + 1][0]);
                  o.save();
                  o.strokeStyle = v.color;
                  o.lineWidth = v.lineWidth;
                  o.beginPath();
                  o.moveTo(t, s);
                  o.lineTo(j, s);
                  o.stroke();
                  o.closePath();
                  o.restore()
              }
          };
          this.clearHit = function(w) {
              var p = w.context,
                  s = w.args,
                  q = w.data,
                  v = w.xScale,
                  o = w.lineWidth,
                  r = s.index,
                  u = v(s.x),
                  t = w.yScale(s.y),
                  j;
              if (q.length - 1 > r) {
                  j = w.xScale(q[r + 1][0]);
                  p.clearRect(u - o, t - o, j - u + 2 * o, 2 * o)
              }
          }
      }
  }
});
Flotr.addType("bars", {
  options: {
      show: false,
      lineWidth: 2,
      barWidth: 1,
      fill: true,
      fillColor: null,
      fillOpacity: 0.4,
      horizontal: false,
      stacked: false,
      centered: true,
      topPadding: 0.1,
      grouped: false
  },
  stack: {
      positive: [],
      negative: [],
      _positive: [],
      _negative: []
  },
  draw: function(a) {
      var b = a.context;
      this.current += 1;
      b.save();
      b.lineJoin = "miter";
      b.lineWidth = a.lineWidth;
      b.strokeStyle = a.color;
      if (a.fill) {
          b.fillStyle = a.fillStyle
      }
      this.plot(a);
      b.restore()
  },
  plot: function(k) {
      var e = k.data,
          c = k.context,
          b = k.shadowSize,
          f,
          g,
          d,
          h,
          a,
          j;
      if (e.length < 1) {
          return
      }
      this.translate(c, k.horizontal);
      for (f = 0; f < e.length; f++) {
          g = this.getBarGeometry(e[f][0], e[f][1], k);
          if (g === null) {
              continue
          }
          d = g.left;
          h = g.top;
          a = g.width;
          j = g.height;
          if (k.fill) {
              c.fillRect(d, h, a, j)
          }
          if (b) {
              c.save();
              c.fillStyle = "rgba(0,0,0,0.05)";
              c.fillRect(d + b, h + b, a, j);
              c.restore()
          }
          if (k.lineWidth) {
              c.strokeRect(d, h, a, j)
          }
      }
  },
  translate: function(b, a) {
      if (a) {
          b.rotate(-Math.PI / 2);
          b.scale(-1, 1)
      }
  },
  getBarGeometry: function(j, h, c) {
      var q = c.horizontal,
          l = c.barWidth,
          p = c.centered,
          e = c.stacked ? this.stack : false,
          a = c.lineWidth,
          s = p ? l / 2 : 0,
          u = q ? c.yScale : c.xScale,
          b = q ? c.xScale : c.yScale,
          m = q ? h : j,
          o = q ? j : h,
          g = 0,
          t,
          d,
          r,
          k,
          f;
      if (c.grouped) {
          this.current / this.groups;
          m = m - s;
          l = l / this.groups;
          s = l / 2;
          m = m + l * this.current - s
      }
      if (e) {
          t = o > 0 ? e.positive : e.negative;
          g = t[m] || g;
          t[m] = g + o
      }
      d = u(m - s);
      r = u(m + l - s);
      k = b(o + g);
      f = b(g);
      if (f < 0) {
          f = 0
      }
      return (j === null || h === null) ? null : {
          x: m,
          y: o,
          xScale: u,
          yScale: b,
          top: k,
          left: Math.min(d, r) - a / 2,
          width: Math.abs(r - d) - a,
          height: f - k
      }
  },
  hit: function(m) {
      var e = m.data,
          g = m.args,
          f = g[0],
          b = g[1],
          l = f.x,
          k = f.y,
          h = this.getBarGeometry(l, k, m),
          a = h.width / 2,
          c = h.left,
          j,
          d;
      for (d = e.length; d--;) {
          j = this.getBarGeometry(e[d][0], e[d][1], m);
          if (j.y > h.y && Math.abs(c - j.left) < a) {
              b.x = e[d][0];
              b.y = e[d][1];
              b.index = d;
              b.seriesIndex = m.index
          }
      }
  },
  drawHit: function(c) {
      var d = c.context,
          b = c.args,
          h = this.getBarGeometry(b.x, b.y, c),
          g = h.left,
          f = h.top,
          e = h.width,
          a = h.height;
      d.save();
      d.strokeStyle = c.color;
      d.lineWidth = c.lineWidth;
      this.translate(d, c.horizontal);
      d.beginPath();
      d.moveTo(g, f + a);
      d.lineTo(g, f);
      d.lineTo(g + e, f);
      d.lineTo(g + e, f + a);
      if (c.fill) {
          d.fillStyle = c.fillStyle;
          d.fill()
      }
      d.stroke();
      d.closePath();
      d.restore()
  },
  clearHit: function(j) {
      var b = j.context,
          e = j.args,
          f = this.getBarGeometry(e.x, e.y, j),
          c = f.left,
          a = f.width,
          g = f.top,
          h = f.height,
          d = 2 * j.lineWidth;
      b.save();
      this.translate(b, j.horizontal);
      b.clearRect(c - d, Math.min(g, g + h) - d, a + 2 * d, Math.abs(h) + 2 * d);
      b.restore()
  },
  extendXRange: function(c, d, b, a) {
      this._extendRange(c, d, b, a);
      this.groups = (this.groups + 1) || 1;
      this.current = 0
  },
  extendYRange: function(c, d, b, a) {
      this._extendRange(c, d, b, a)
  },
  _extendRange: function(c, g, r, q) {
      var m = c.options.max;
      if (_.isNumber(m) || _.isString(m)) {
          return
      }
      var e = c.min,
          k = c.max,
          a = r.horizontal,
          b = c.orientation,
          d = this.positiveSums || {},
          l = this.negativeSums || {},
          p,
          o,
          h,
          f;
      if ((b == 1 && !a) || (b == -1 && a)) {
          if (r.centered) {
              k = Math.max(c.datamax + r.barWidth, k);
              e = Math.min(c.datamin - r.barWidth, e)
          }
      }
      if (r.stacked && ((b == 1 && a) || (b == -1 && !a))) {
          for (f = g.length; f--;) {
              p = g[f][(b == 1 ? 1 : 0)] + "";
              o = g[f][(b == 1 ? 0 : 1)];
              if (o > 0) {
                  d[p] = (d[p] || 0) + o;
                  k = Math.max(k, d[p])
              } else {
                  l[p] = (l[p] || 0) + o;
                  e = Math.min(e, l[p])
              }
          }
      }
      if ((b == 1 && a) || (b == -1 && !a)) {
          if (r.topPadding && (c.max === c.datamax || (r.stacked && this.stackMax !== k))) {
              k += r.topPadding * (k - e)
          }
      }
      this.stackMin = e;
      this.stackMax = k;
      this.negativeSums = l;
      this.positiveSums = d;
      c.max = k;
      c.min = e
  }
});
Flotr.addType("bubbles", {
  options: {
      show: false,
      lineWidth: 2,
      fill: true,
      fillOpacity: 0.4,
      baseRadius: 2
  },
  draw: function(a) {
      var b = a.context,
          c = a.shadowSize;
      b.save();
      b.lineWidth = a.lineWidth;
      b.fillStyle = "rgba(0,0,0,0.05)";
      b.strokeStyle = "rgba(0,0,0,0.05)";
      this.plot(a, c / 2);
      b.strokeStyle = "rgba(0,0,0,0.1)";
      this.plot(a, c / 4);
      b.strokeStyle = a.color;
      b.fillStyle = a.fillStyle;
      this.plot(a);
      b.restore()
  },
  plot: function(j, b) {
      var c = j.data,
          a = j.context,
          g,
          d,
          h,
          f,
          e;
      b = b || 0;
      for (d = 0; d < c.length; ++d) {
          g = this.getGeometry(c[d], j);
          a.beginPath();
          a.arc(g.x + b, g.y + b, g.z, 0, 2 * Math.PI, true);
          a.stroke();
          if (j.fill) {
              a.fill()
          }
          a.closePath()
      }
  },
  getGeometry: function(a, b) {
      return {
          x: b.xScale(a[0]),
          y: b.yScale(a[1]),
          z: a[2] * b.baseRadius
      }
  },
  hit: function(l) {
      var c = l.data,
          e = l.args,
          d = e[0],
          b = e[1],
          h = d.x,
          g = d.y,
          a,
          f,
          k,
          j;
      b.best = b.best || Number.MAX_VALUE;
      for (i = c.length; i--;) {
          f = this.getGeometry(c[i], l);
          k = f.x - l.xScale(h);
          j = f.y - l.yScale(g);
          a = Math.sqrt(k * k + j * j);
          if (a < f.z && f.z < b.best) {
              b.x = c[i][0];
              b.y = c[i][1];
              b.index = i;
              b.seriesIndex = l.index;
              b.best = f.z
          }
      }
  },
  drawHit: function(a) {
      var b = a.context,
          c = this.getGeometry(a.data[a.args.index], a);
      b.save();
      b.lineWidth = a.lineWidth;
      b.fillStyle = a.fillStyle;
      b.strokeStyle = a.color;
      b.beginPath();
      b.arc(c.x, c.y, c.z, 0, 2 * Math.PI, true);
      b.fill();
      b.stroke();
      b.closePath();
      b.restore()
  },
  clearHit: function(a) {
      var b = a.context,
          d = this.getGeometry(a.data[a.args.index], a),
          c = d.z + a.lineWidth;
      b.save();
      b.clearRect(d.x - c, d.y - c, 2 * c, 2 * c);
      b.restore()
  }
});
Flotr.addType("candles", {
  options: {
      show: false,
      lineWidth: 1,
      wickLineWidth: 1,
      candleWidth: 0.6,
      fill: true,
      upFillColor: "#00A8F0",
      downFillColor: "#CB4B4B",
      fillOpacity: 0.5,
      barcharts: false
  },
  draw: function(a) {
      var b = a.context;
      b.save();
      b.lineJoin = "miter";
      b.lineCap = "butt";
      b.lineWidth = a.wickLineWidth || a.lineWidth;
      this.plot(a);
      b.restore()
  },
  plot: function(e) {
      var A = e.data,
          d = e.context,
          B = e.xScale,
          c = e.yScale,
          r = e.candleWidth / 2,
          l = e.shadowSize,
          a = e.lineWidth,
          s = e.wickLineWidth,
          g = (s % 2) / 2,
          t,
          w,
          m,
          j,
          o,
          k,
          C,
          q,
          f,
          z,
          h,
          p,
          b,
          u,
          v;
      if (A.length < 1) {
          return
      }
      for (v = 0; v < A.length; v++) {
          w = A[v];
          m = w[0];
          o = w[1];
          k = w[2];
          C = w[3];
          q = w[4];
          f = B(m - r);
          z = B(m + r);
          h = c(C);
          p = c(k);
          b = c(Math.min(o, q));
          u = c(Math.max(o, q));
          t = e[o > q ? "downFillColor" : "upFillColor"];
          if (e.fill && !e.barcharts) {
              d.fillStyle = "rgba(0,0,0,0.05)";
              d.fillRect(f + l, u + l, z - f, b - u);
              d.save();
              d.globalAlpha = e.fillOpacity;
              d.fillStyle = t;
              d.fillRect(f, u + a, z - f, b - u);
              d.restore()
          }
          if (a || s) {
              m = Math.floor((f + z) / 2) + g;
              d.strokeStyle = t;
              d.beginPath();
              if (e.barcharts) {
                  d.moveTo(m, Math.floor(p + r));
                  d.lineTo(m, Math.floor(h + r));
                  j = Math.floor(o + r) + 0.5;
                  d.moveTo(Math.floor(f) + g, j);
                  d.lineTo(m, j);
                  j = Math.floor(q + r) + 0.5;
                  d.moveTo(Math.floor(z) + g, j);
                  d.lineTo(m, j)
              } else {
                  d.strokeRect(f, u + a, z - f, b - u);
                  d.moveTo(m, Math.floor(u + a));
                  d.lineTo(m, Math.floor(p + a));
                  d.moveTo(m, Math.floor(b + a));
                  d.lineTo(m, Math.floor(h + a))
              }
              d.closePath();
              d.stroke()
          }
      }
  },
  extendXRange: function(b, c, a) {
      if (b.options.max === null) {
          b.max = Math.max(b.datamax + 0.5, b.max);
          b.min = Math.min(b.datamin - 0.5, b.min)
      }
  }
});
Flotr.addType("gantt", {
  options: {
      show: false,
      lineWidth: 2,
      barWidth: 1,
      fill: true,
      fillColor: null,
      fillOpacity: 0.4,
      centered: true
  },
  draw: function(c) {
      var a = this.ctx,
          e = c.gantt.barWidth,
          d = Math.min(c.gantt.lineWidth, e);
      a.save();
      a.translate(this.plotOffset.left, this.plotOffset.top);
      a.lineJoin = "miter";
      a.lineWidth = d;
      a.strokeStyle = c.color;
      a.save();
      this.gantt.plotShadows(c, e, 0, c.gantt.fill);
      a.restore();
      if (c.gantt.fill) {
          var b = c.gantt.fillColor || c.color;
          a.fillStyle = this.processColor(b, {
              opacity: c.gantt.fillOpacity
          })
      }
      this.gantt.plot(c, e, 0, c.gantt.fill);
      a.restore()
  },
  plot: function(j, o, e, q) {
      var w = j.data;
      if (w.length < 1) {
          return
      }
      var t = j.xaxis,
          b = j.yaxis,
          p = this.ctx,
          r;
      for (r = 0; r < w.length; r++) {
          var h = w[r][0],
              l = w[r][1],
              u = w[r][2],
              f = true,
              k = true,
              a = true;
          if (l === null || u === null) {
              continue
          }
          var c = l,
              v = l + u,
              g = h - (j.gantt.centered ? o / 2 : 0),
              m = h + o - (j.gantt.centered ? o / 2 : 0);
          if (v < t.min || c > t.max || m < b.min || g > b.max) {
              continue
          }
          if (c < t.min) {
              c = t.min;
              f = false
          }
          if (v > t.max) {
              v = t.max;
              if (t.lastSerie != j) {
                  k = false
              }
          }
          if (g < b.min) {
              g = b.min
          }
          if (m > b.max) {
              m = b.max;
              if (b.lastSerie != j) {
                  k = false
              }
          }
          if (q) {
              p.beginPath();
              p.moveTo(t.d2p(c), b.d2p(g) + e);
              p.lineTo(t.d2p(c), b.d2p(m) + e);
              p.lineTo(t.d2p(v), b.d2p(m) + e);
              p.lineTo(t.d2p(v), b.d2p(g) + e);
              p.fill();
              p.closePath()
          }
          if (j.gantt.lineWidth && (f || a || k)) {
              p.beginPath();
              p.moveTo(t.d2p(c), b.d2p(g) + e);
              p[f ? "lineTo" : "moveTo"](t.d2p(c), b.d2p(m) + e);
              p[k ? "lineTo" : "moveTo"](t.d2p(v), b.d2p(m) + e);
              p[a ? "lineTo" : "moveTo"](t.d2p(v), b.d2p(g) + e);
              p.stroke();
              p.closePath()
          }
      }
  },
  plotShadows: function(g, j, c) {
      var v = g.data;
      if (v.length < 1) {
          return
      }
      var q,
          f,
          h,
          t,
          r = g.xaxis,
          a = g.yaxis,
          p = this.ctx,
          m = this.options.shadowSize;
      for (q = 0; q < v.length; q++) {
          f = v[q][0];
          h = v[q][1];
          t = v[q][2];
          if (h === null || t === null) {
              continue
          }
          var b = h,
              u = h + t,
              e = f - (g.gantt.centered ? j / 2 : 0),
              k = f + j - (g.gantt.centered ? j / 2 : 0);
          if (u < r.min || b > r.max || k < a.min || e > a.max) {
              continue
          }
          if (b < r.min) {
              b = r.min
          }
          if (u > r.max) {
              u = r.max
          }
          if (e < a.min) {
              e = a.min
          }
          if (k > a.max) {
              k = a.max
          }
          var o = r.d2p(u) - r.d2p(b) - ((r.d2p(u) + m <= this.plotWidth) ? 0 : m);
          var l = a.d2p(e) - a.d2p(k) - ((a.d2p(e) + m <= this.plotHeight) ? 0 : m);
          p.fillStyle = "rgba(0,0,0,0.05)";
          p.fillRect(Math.min(r.d2p(b) + m, this.plotWidth), Math.min(a.d2p(k) + m, this.plotHeight), o, l)
      }
  },
  extendXRange: function(b) {
      if (b.options.max === null) {
          var c = b.min,
              k = b.max,
              e,
              d,
              m,
              o,
              h,
              a = {},
              l = {},
              f = null;
          for (e = 0; e < this.series.length; ++e) {
              o = this.series[e];
              h = o.gantt;
              if (h.show && o.xaxis == b) {
                  for (d = 0; d < o.data.length; d++) {
                      if (h.show) {
                          y = o.data[d][0] + "";
                          a[y] = Math.max((a[y] || 0), o.data[d][1] + o.data[d][2]);
                          f = o
                      }
                  }
                  for (d in a) {
                      k = Math.max(a[d], k)
                  }
              }
          }
          b.lastSerie = f;
          b.max = k;
          b.min = c
      }
  },
  extendYRange: function(b) {
      if (b.options.max === null) {
          var l = Number.MIN_VALUE,
              d = Number.MAX_VALUE,
              f,
              e,
              p,
              k,
              a = {},
              m = {},
              h = null;
          for (f = 0; f < this.series.length; ++f) {
              p = this.series[f];
              k = p.gantt;
              if (k.show && !p.hide && p.yaxis == b) {
                  var c = Number.MIN_VALUE,
                      o = Number.MAX_VALUE;
                  for (e = 0; e < p.data.length; e++) {
                      c = Math.max(c, p.data[e][0]);
                      o = Math.min(o, p.data[e][0])
                  }
                  if (k.centered) {
                      l = Math.max(c + 0.5, l);
                      d = Math.min(o - 0.5, d)
                  } else {
                      l = Math.max(c + 1, l);
                      d = Math.min(o, d)
                  }
                  if (k.barWidth + c > l) {
                      l = b.max + k.barWidth
                  }
              }
          }
          b.lastSerie = h;
          b.max = l;
          b.min = d;
          b.tickSize = Flotr.getTickSize(b.options.noTicks, d, l, b.options.tickDecimals)
      }
  }
});
(function() {
  Flotr.defaultMarkerFormatter = function(b) {
      return (Math.round(b.y * 100) / 100) + ""
  };
  Flotr.addType("markers", {
      options: {
          show: false,
          lineWidth: 1,
          color: "#000000",
          fill: false,
          fillColor: "#FFFFFF",
          fillOpacity: 0.4,
          stroke: false,
          position: "ct",
          verticalMargin: 0,
          labelFormatter: Flotr.defaultMarkerFormatter,
          fontSize: Flotr.defaultOptions.fontSize,
          stacked: false,
          stackingType: "b",
          horizontal: false
      },
      stack: {
          positive: [],
          negative: [],
          values: []
      },
      draw: function(p) {
          var f = p.data,
              c = p.context,
              l = p.stacked ? p.stack : false,
              j = p.stackingType,
              b,
              h,
              g,
              e,
              o,
              k,
              m;
          c.save();
          c.lineJoin = "round";
          c.lineWidth = p.lineWidth;
          c.strokeStyle = "rgba(0,0,0,0.5)";
          c.fillStyle = p.fillStyle;
          function d(r, q) {
              h = l.negative[r] || 0;
              b = l.positive[r] || 0;
              if (q > 0) {
                  l.positive[r] = h + q;
                  return h + q
              } else {
                  l.negative[r] = b + q;
                  return b + q
              }
          }
          for (e = 0; e < f.length; ++e) {
              o = f[e][0];
              k = f[e][1];
              if (l) {
                  if (j == "b") {
                      if (p.horizontal) {
                          k = d(k, o)
                      } else {
                          o = d(o, k)
                      }
                  } else {
                      if (j == "a") {
                          g = l.values[o] || 0;
                          l.values[o] = g + k;
                          k = g + k
                      }
                  }
              }
              m = p.labelFormatter({
                  x: o,
                  y: k,
                  index: e,
                  data: f
              });
              this.plot(p.xScale(o), p.yScale(k), m, p)
          }
          c.restore()
      },
      plot: function(b, f, d, c) {
          var e = c.context;
          if (a(d) && !d.complete) {
              throw "Marker image not loaded."
          } else {
              this._plot(b, f, d, c)
          }
      },
      _plot: function(j, f, h, k) {
          var b = k.context,
              d = 2,
              c = j,
              g = f,
              e;
          if (a(h)) {
              e = {
                  height: h.height,
                  width: h.width
              }
          } else {
              e = k.text.canvas(h)
          }
          e.width = Math.floor(e.width + d * 2);
          e.height = Math.floor(e.height + d * 2);
          if (k.position.indexOf("c") != -1) {
              c -= e.width / 2 + d
          } else {
              if (k.position.indexOf("l") != -1) {
                  c -= e.width
              }
          }
          if (k.position.indexOf("m") != -1) {
              g -= e.height / 2 + d
          } else {
              if (k.position.indexOf("t") != -1) {
                  g -= e.height + k.verticalMargin
              } else {
                  g += k.verticalMargin
              }
          }
          c = Math.floor(c) + 0.5;
          g = Math.floor(g) + 0.5;
          if (k.fill) {
              b.fillRect(c, g, e.width, e.height)
          }
          if (k.stroke) {
              b.strokeRect(c, g, e.width, e.height)
          }
          if (a(h)) {
              b.drawImage(h, c + d, g + d)
          } else {
              Flotr.drawText(b, h, c + d, g + d, {
                  textBaseline: "top",
                  textAlign: "left",
                  size: k.fontSize,
                  color: k.color
              })
          }
      }
  });
  function a(b) {
      return typeof b === "object" && b.constructor && (Image ? true : b.constructor === Image)
  }
})();
(function() {
  var a = Flotr._;
  Flotr.defaultPieLabelFormatter = function(b, c) {
      return (100 * c / b).toFixed(2) + "%"
  };
  Flotr.addType("pie", {
      options: {
          show: false,
          lineWidth: 1,
          fill: true,
          fillColor: null,
          fillOpacity: 0.6,
          explode: 6,
          sizeRatio: 0.6,
          startAngle: Math.PI / 4,
          labelFormatter: Flotr.defaultPieLabelFormatter,
          pie3D: false,
          pie3DviewAngle: (Math.PI / 2 * 0.8),
          pie3DspliceThickness: 20
      },
      draw: function(f) {
          var J = f.data,
              c = f.context,
              e = c.canvas,
              b = f.lineWidth,
              o = f.shadowSize,
              k = f.sizeRatio,
              u = f.height,
              w = f.width,
              B = f.explode,
              C = f.color,
              E = f.fill,
              j = f.fillStyle,
              g = Math.min(e.width, e.height) * k / 2,
              A = J[0][1],
              q = [],
              F = 1,
              d = Math.PI * 2 * A / this.total,
              D = this.startAngle || (2 * Math.PI * f.startAngle),
              v = D + d,
              I = D + d / 2,
              l = f.labelFormatter(this.total, A),
              z = B + g + 4,
              t = Math.cos(I) * z,
              s = Math.sin(I) * z,
              h = t < 0 ? "right" : "left",
              H = s > 0 ? "top" : "bottom",
              G,
              p,
              m,
              t,
              s;
          c.save();
          c.translate(w / 2, u / 2);
          c.scale(1, F);
          p = Math.cos(I) * B;
          m = Math.sin(I) * B;
          if (o > 0) {
              this.plotSlice(p + o, m + o, g, D, v, c);
              if (E) {
                  c.fillStyle = "rgba(0,0,0,0.1)";
                  c.fill()
              }
          }
          this.plotSlice(p, m, g, D, v, c);
          if (E) {
              c.fillStyle = j;
              c.fill()
          }
          c.lineWidth = b;
          c.strokeStyle = C;
          c.stroke();
          G = {
              size: f.fontSize * 1.2,
              color: f.fontColor,
              weight: 1.5
          };
          if (l) {
              if (f.htmlText || !f.textEnabled) {
                  divStyle = "position:absolute;" + H + ":" + (u / 2 + (H === "top" ? s : -s)) + "px;";
                  divStyle += h + ":" + (w / 2 + (h === "right" ? -t : t)) + "px;";
                  q.push('<div style="', divStyle, '" class="flotr-grid-label">', l, "</div>")
              } else {
                  G.textAlign = h;
                  G.textBaseline = H;
                  Flotr.drawText(c, l, t, s, G)
              }
          }
          if (f.htmlText || !f.textEnabled) {
              var r = Flotr.DOM.node('<div style="color:' + f.fontColor + '" class="flotr-labels"></div>');
              Flotr.DOM.insert(r, q.join(""));
              Flotr.DOM.insert(f.element, r)
          }
          c.restore();
          this.startAngle = v;
          this.slices = this.slices || [];
          this.slices.push({
              radius: Math.min(e.width, e.height) * k / 2,
              x: p,
              y: m,
              explode: B,
              start: D,
              end: v
          })
      },
      plotSlice: function(c, g, b, f, d, e) {
          e.beginPath();
          e.moveTo(c, g);
          e.arc(c, g, b, f, d, false);
          e.lineTo(c, g);
          e.closePath()
      },
      hit: function(s) {
          var h = s.data[0],
              l = s.args,
              j = s.index,
              k = l[0],
              f = l[1],
              q = this.slices[j],
              p = k.relX - s.width / 2,
              o = k.relY - s.height / 2,
              b = Math.sqrt(p * p + o * o),
              e = Math.atan(o / p),
              c = Math.PI * 2,
              m = q.explode || s.explode,
              d = q.start % c,
              g = q.end % c;
          if (p < 0) {
              e += Math.PI
          } else {
              if (p > 0 && o < 0) {
                  e += c
              }
          }
          if (b < q.radius + m && b > m) {
              if ((d >= g && (e < g || e > d)) || (e > d && e < g)) {
                  f.x = h[0];
                  f.y = h[1];
                  f.sAngle = d;
                  f.eAngle = g;
                  f.index = 0;
                  f.seriesIndex = j;
                  f.fraction = h[1] / this.total
              }
          }
      },
      drawHit: function(b) {
          var c = b.context,
              d = this.slices[b.args.seriesIndex];
          c.save();
          c.translate(b.width / 2, b.height / 2);
          this.plotSlice(d.x, d.y, d.radius, d.start, d.end, c);
          c.stroke();
          c.restore()
      },
      clearHit: function(c) {
          var d = c.context,
              f = this.slices[c.args.seriesIndex],
              e = 2 * c.lineWidth,
              b = f.radius + e;
          d.save();
          d.translate(c.width / 2, c.height / 2);
          d.clearRect(f.x - b, f.y - b, 2 * b + e, 2 * b + e);
          d.restore()
      },
      extendYRange: function(b, c) {
          this.total = (this.total || 0) + c[0][1]
      }
  })
})();
Flotr.addType("points", {
  options: {
      show: false,
      radius: 3,
      lineWidth: 2,
      fill: true,
      fillColor: "#FFFFFF",
      fillOpacity: 0.4
  },
  draw: function(b) {
      var c = b.context,
          a = b.lineWidth,
          d = b.shadowSize;
      c.save();
      if (d > 0) {
          c.lineWidth = d / 2;
          c.strokeStyle = "rgba(0,0,0,0.1)";
          this.plot(b, d / 2 + c.lineWidth / 2);
          c.strokeStyle = "rgba(0,0,0,0.2)";
          this.plot(b, c.lineWidth / 2)
      }
      c.lineWidth = b.lineWidth;
      c.strokeStyle = b.color;
      c.fillStyle = b.fillColor || b.color;
      this.plot(b);
      c.restore()
  },
  plot: function(j, c) {
      var d = j.data,
          a = j.context,
          h = j.xScale,
          b = j.yScale,
          e,
          g,
          f;
      for (e = d.length - 1; e > -1; --e) {
          f = d[e][1];
          if (f === null) {
              continue
          }
          g = h(d[e][0]);
          f = b(f);
          if (g < 0 || g > j.width || f < 0 || f > j.height) {
              continue
          }
          a.beginPath();
          if (c) {
              a.arc(g, f + c, j.radius, 0, Math.PI, false)
          } else {
              a.arc(g, f, j.radius, 0, 2 * Math.PI, true);
              if (j.fill) {
                  a.fill()
              }
          }
          a.stroke();
          a.closePath()
      }
  }
});
Flotr.addType("radar", {
  options: {
      show: false,
      lineWidth: 2,
      fill: true,
      fillOpacity: 0.4,
      radiusRatio: 0.9
  },
  draw: function(a) {
      var b = a.context,
          c = a.shadowSize;
      b.save();
      b.translate(a.width / 2, a.height / 2);
      b.lineWidth = a.lineWidth;
      b.fillStyle = "rgba(0,0,0,0.05)";
      b.strokeStyle = "rgba(0,0,0,0.05)";
      this.plot(a, c / 2);
      b.strokeStyle = "rgba(0,0,0,0.1)";
      this.plot(a, c / 4);
      b.strokeStyle = a.color;
      b.fillStyle = a.fillStyle;
      this.plot(a);
      b.restore()
  },
  plot: function(j, d) {
      var e = j.data,
          a = j.context,
          g = Math.min(j.height, j.width) * j.radiusRatio / 2,
          b = 2 * Math.PI / e.length,
          c = -Math.PI / 2,
          f,
          h;
      d = d || 0;
      a.beginPath();
      for (f = 0; f < e.length; ++f) {
          h = e[f][1] / this.max;
          a[f === 0 ? "moveTo" : "lineTo"](Math.cos(f * b + c) * g * h + d, Math.sin(f * b + c) * g * h + d)
      }
      a.closePath();
      if (j.fill) {
          a.fill()
      }
      a.stroke()
  },
  extendYRange: function(a, b) {
      this.max = Math.max(a.max, this.max || -Number.MAX_VALUE)
  }
});
Flotr.addType("timeline", {
  options: {
      show: false,
      lineWidth: 1,
      barWidth: 0.2,
      fill: true,
      fillColor: null,
      fillOpacity: 0.4,
      centered: true
  },
  draw: function(a) {
      var b = a.context;
      b.save();
      b.lineJoin = "miter";
      b.lineWidth = a.lineWidth;
      b.strokeStyle = a.color;
      b.fillStyle = a.fillStyle;
      this.plot(a);
      b.restore()
  },
  plot: function(b) {
      var h = b.data,
          d = b.context,
          g = b.xScale,
          f = b.yScale,
          e = b.barWidth,
          a = b.lineWidth,
          c;
      Flotr._.each(h, function(u) {
          var q = u[0],
              o = u[1],
              s = u[2],
              l = e,
              k = Math.ceil(g(q)),
              m = Math.ceil(g(q + s)) - k,
              t = Math.round(f(o)),
              p = Math.round(f(o - l)) - t,
              j = k - a / 2,
              r = Math.round(t - p / 2) - a / 2;
          d.strokeRect(j, r, m, p);
          d.fillRect(j, r, m, p)
      })
  },
  extendRange: function(d) {
      var e = d.data,
          f = d.xaxis,
          c = d.yaxis,
          b = d.timeline.barWidth;
      if (f.options.min === null) {
          f.min = f.datamin - b / 2
      }
      if (f.options.max === null) {
          var a = f.max;
          Flotr._.each(e, function(g) {
              a = Math.max(a, g[0] + g[2])
          }, this);
          f.max = a + b / 2
      }
      if (c.options.min === null) {
          c.min = c.datamin - b
      }
      if (c.options.min === null) {
          c.max = c.datamax + b
      }
  }
});
(function() {
  var a = Flotr.DOM;
  Flotr.addPlugin("crosshair", {
      options: {
          mode: null,
          color: "#FF0000",
          hideCursor: true
      },
      callbacks: {
          "flotr:mousemove": function(b, c) {
              if (this.options.crosshair.mode) {
                  this.crosshair.clearCrosshair();
                  this.crosshair.drawCrosshair(c)
              }
          }
      },
      drawCrosshair: function(g) {
          var e = this.octx,
              d = this.options.crosshair,
              c = this.plotOffset,
              b = c.left + g.relX + 0.5,
              f = c.top + g.relY + 0.5;
          if (g.relX < 0 || g.relY < 0 || g.relX > this.plotWidth || g.relY > this.plotHeight) {
              this.el.style.cursor = null;
              a.removeClass(this.el, "flotr-crosshair");
              return
          }
          if (d.hideCursor) {
              this.el.style.cursor = "none";
              a.addClass(this.el, "flotr-crosshair")
          }
          e.save();
          e.strokeStyle = d.color;
          e.lineWidth = 1;
          e.beginPath();
          if (d.mode.indexOf("x") != -1) {
              e.moveTo(b, c.top);
              e.lineTo(b, c.top + this.plotHeight)
          }
          if (d.mode.indexOf("y") != -1) {
              e.moveTo(c.left, f);
              e.lineTo(c.left + this.plotWidth, f)
          }
          e.stroke();
          e.restore()
      },
      clearCrosshair: function() {
          var c = this.plotOffset,
              b = this.lastMousePos,
              d = this.octx;
          if (b) {
              d.clearRect(b.relX + c.left, c.top, 1, this.plotHeight + 1);
              d.clearRect(c.left, b.relY + c.top, this.plotWidth + 1, 1)
          }
      }
  })
})();
(function() {
  var c = Flotr.DOM,
      b = Flotr._;
  function a(g, e, f, d) {
      var j = "image/" + g,
          h = e.toDataURL(j),
          k = new Image();
      k.src = h;
      return k
  }
  Flotr.addPlugin("download", {
      saveImage: function(g, f, d, e) {
          var h = null;
          if (Flotr.isIE && Flotr.isIE < 9) {
              h = "<html><body>" + this.canvas.firstChild.innerHTML + "</body></html>";
              return window.open().document.write(h)
          }
          if (g !== "jpeg" && g !== "png") {
              return
          }
          h = a(g, this.canvas, f, d);
          if (b.isElement(h) && e) {
              this.download.restoreCanvas();
              c.hide(this.canvas);
              c.hide(this.overlay);
              c.setStyles({
                  position: "absolute"
              });
              c.insert(this.el, h);
              this.saveImageElement = h
          } else {
              return window.open(h.src)
          }
      },
      restoreCanvas: function() {
          c.show(this.canvas);
          c.show(this.overlay);
          if (this.saveImageElement) {
              this.el.removeChild(this.saveImageElement)
          }
          this.saveImageElement = null
      }
  })
})();
(function() {
  var b = Flotr.EventAdapter,
      a = Flotr._;
  Flotr.addPlugin("graphGrid", {
      callbacks: {
          "flotr:beforedraw": function() {
              this.graphGrid.drawGrid()
          },
          "flotr:afterdraw": function() {
              this.graphGrid.drawOutline()
          }
      },
      drawGrid: function() {
          var q = this.ctx,
              e = this.options,
              c = e.grid,
              h = c.verticalLines,
              A = c.horizontalLines,
              p = c.minorVerticalLines,
              z = c.minorHorizontalLines,
              s = this.plotHeight,
              g = this.plotWidth,
              B,
              k,
              t,
              r;
          if (h || p || A || z) {
              b.fire(this.el, "flotr:beforegrid", [this.axes.x, this.axes.y, e, this])
          }
          q.save();
          q.lineWidth = 1;
          q.strokeStyle = c.tickColor;
          function o(v) {
              for (t = 0; t < v.length; ++t) {
                  var j = v[t].v / B.max;
                  for (r = 0; r <= w; ++r) {
                      q[r === 0 ? "moveTo" : "lineTo"](Math.cos(r * d + u) * f * j, Math.sin(r * d + u) * f * j)
                  }
              }
          }
          function l(j, v) {
              a.each(a.pluck(j, "v"), function(D) {
                  if ((D <= B.min || D >= B.max) || (D == B.min || D == B.max) && c.outlineWidth) {
                      return
                  }
                  v(Math.floor(B.d2p(D)) + q.lineWidth / 2)
              })
          }
          function m(j) {
              q.moveTo(j, 0);
              q.lineTo(j, s)
          }
          function C(j) {
              q.moveTo(0, j);
              q.lineTo(g, j)
          }
          if (c.circular) {
              q.translate(this.plotOffset.left + g / 2, this.plotOffset.top + s / 2);
              var f = Math.min(s, g) * e.radar.radiusRatio / 2,
                  w = this.axes.x.ticks.length,
                  d = 2 * (Math.PI / w),
                  u = -Math.PI / 2;
              q.beginPath();
              B = this.axes.y;
              if (A) {
                  o(B.ticks)
              }
              if (z) {
                  o(B.minorTicks)
              }
              if (h) {
                  a.times(w, function(j) {
                      q.moveTo(0, 0);
                      q.lineTo(Math.cos(j * d + u) * f, Math.sin(j * d + u) * f)
                  })
              }
              q.stroke()
          } else {
              q.translate(this.plotOffset.left, this.plotOffset.top);
              if (c.backgroundColor) {
                  q.fillStyle = this.processColor(c.backgroundColor, {
                      x1: 0,
                      y1: 0,
                      x2: g,
                      y2: s
                  });
                  q.fillRect(0, 0, g, s)
              }
              q.beginPath();
              B = this.axes.x;
              if (h) {
                  l(B.ticks, m)
              }
              if (p) {
                  l(B.minorTicks, m)
              }
              B = this.axes.y;
              if (A) {
                  l(B.ticks, C)
              }
              if (z) {
                  l(B.minorTicks, C)
              }
              q.stroke()
          }
          q.restore();
          if (h || p || A || z) {
              b.fire(this.el, "flotr:aftergrid", [this.axes.x, this.axes.y, e, this])
          }
      },
      drawOutline: function() {
          var p = this,
              g = p.options,
              c = g.grid,
              l = c.outline,
              z = p.ctx,
              e = c.backgroundImage,
              q = p.plotOffset,
              r = q.left,
              A = q.top,
              m = p.plotWidth,
              B = p.plotHeight,
              s,
              F,
              o,
              j,
              w,
              C;
          if (!c.outlineWidth) {
              return
          }
          z.save();
          if (c.circular) {
              z.translate(r + m / 2, A + B / 2);
              var h = Math.min(B, m) * g.radar.radiusRatio / 2,
                  E = this.axes.x.ticks.length,
                  d = 2 * (Math.PI / E),
                  D = -Math.PI / 2;
              z.beginPath();
              z.lineWidth = c.outlineWidth;
              z.strokeStyle = c.color;
              z.lineJoin = "round";
              for (i = 0; i <= E; ++i) {
                  z[i === 0 ? "moveTo" : "lineTo"](Math.cos(i * d + D) * h, Math.sin(i * d + D) * h)
              }
              z.stroke()
          } else {
              z.translate(r, A);
              var k = c.outlineWidth,
                  f = 0.5 - k + ((k + 1) % 2 / 2),
                  t = "lineTo",
                  u = "moveTo";
              z.lineWidth = k;
              z.strokeStyle = c.color;
              z.lineJoin = "miter";
              z.beginPath();
              z.moveTo(f, f);
              m = m - (k / 2) % 1;
              B = B + k / 2;
              z[l.indexOf("n") !== -1 ? t : u](m, f);
              z[l.indexOf("e") !== -1 ? t : u](m, B);
              z[l.indexOf("s") !== -1 ? t : u](f, B);
              z[l.indexOf("w") !== -1 ? t : u](f, f);
              z.stroke();
              z.closePath()
          }
          z.restore();
          if (e) {
              o = e.src || e;
              j = (parseInt(e.left, 10) || 0) + q.left;
              w = (parseInt(e.top, 10) || 0) + q.top;
              F = new Image();
              F.onload = function() {
                  z.save();
                  if (e.alpha) {
                      z.globalAlpha = e.alpha
                  }
                  z.globalCompositeOperation = "destination-over";
                  z.drawImage(F, 0, 0, F.width, F.height, j, w, m, B);
                  z.restore()
              };
              F.src = o
          }
      }
  })
})();
(function() {
  var d = Flotr.DOM,
      b = Flotr._,
      c = Flotr,
      a = "opacity:0.7;background-color:#000;color:#fff;display:none;position:absolute;padding:2px 8px;-moz-border-radius:4px;border-radius:4px;white-space:nowrap;";
  Flotr.addPlugin("hit", {
      callbacks: {
          "flotr:mousemove": function(f, g) {
              this.hit.track(g)
          },
          "flotr:click": function(e) {
              this.hit.track(e)
          },
          "flotr:mouseout": function() {
              this.hit.clearHit()
          }
      },
      track: function(e) {
          if (this.options.mouse.track || b.any(this.series, function(f) {
              return f.mouse && f.mouse.track
          })) {
              this.hit.hit(e)
          }
      },
      executeOnType: function(h, l, g) {
          var k = false,
              f;
          if (!b.isArray(h)) {
              h = [h]
          }
          function j(m, e) {
              b.each(b.keys(c.graphTypes), function(o) {
                  if (m[o] && m[o].show && this[o][l]) {
                      f = this.getOptions(m, o);
                      f.fill = !!m.mouse.fillColor;
                      f.fillStyle = this.processColor(m.mouse.fillColor || "#ffffff", {
                          opacity: m.mouse.fillOpacity
                      });
                      f.color = m.mouse.lineColor;
                      f.context = this.octx;
                      f.index = e;
                      if (g) {
                          f.args = g
                      }
                      this[o][l].call(this[o], f);
                      k = true
                  }
              }, this)
          }
          b.each(h, j, this);
          return k
      },
      drawHit: function(j) {
          var g = this.octx,
              f = j.series;
          if (f.mouse.lineColor) {
              g.save();
              g.lineWidth = (f.points ? f.points.lineWidth : 1);
              g.strokeStyle = f.mouse.lineColor;
              g.fillStyle = this.processColor(f.mouse.fillColor || "#ffffff", {
                  opacity: f.mouse.fillOpacity
              });
              g.translate(this.plotOffset.left, this.plotOffset.top);
              if (!this.hit.executeOnType(f, "drawHit", j)) {
                  var h = j.xaxis,
                      e = j.yaxis;
                  g.beginPath();
                  g.arc(h.d2p(j.x), e.d2p(j.y), f.points.radius || f.mouse.radius, 0, 2 * Math.PI, true);
                  g.fill();
                  g.stroke();
                  g.closePath()
              }
              g.restore();
              this.clip(g)
          }
          this.prevHit = j
      },
      clearHit: function() {
          var g = this.prevHit,
              j = this.octx,
              e = this.plotOffset;
          j.save();
          j.translate(e.left, e.top);
          if (g) {
              if (!this.hit.executeOnType(g.series, "clearHit", this.prevHit)) {
                  var f = g.series,
                      h = (f.points ? f.points.lineWidth : 1);
                  offset = (f.points.radius || f.mouse.radius) + h;
                  j.clearRect(g.xaxis.d2p(g.x) - offset, g.yaxis.d2p(g.y) - offset, offset * 2, offset * 2)
              }
              d.hide(this.mouseTrack);
              this.prevHit = null
          }
          j.restore()
      },
      hit: function(k) {
          var q = this.options,
              f = this.prevHit,
              e,
              g,
              m,
              h,
              j,
              p,
              o,
              l;
          if (this.series.length === 0) {
              return
          }
          n = {
              relX: k.relX,
              relY: k.relY,
              absX: k.absX,
              absY: k.absY
          };
          if (q.mouse.trackY && !q.mouse.trackAll && this.hit.executeOnType(this.series, "hit", [k, n])) {
              if (!b.isUndefined(n.seriesIndex)) {
                  j = this.series[n.seriesIndex];
                  n.series = j;
                  n.mouse = j.mouse;
                  n.xaxis = j.xaxis;
                  n.yaxis = j.yaxis
              }
          } else {
              e = this.hit.closest(k);
              if (e) {
                  e = q.mouse.trackY ? e.point : e.x;
                  h = e.seriesIndex;
                  j = this.series[h];
                  o = j.xaxis;
                  l = j.yaxis;
                  g = 2 * j.mouse.sensibility;
                  if (q.mouse.trackAll || (e.distanceX < g / o.scale && (!q.mouse.trackY || e.distanceY < g / l.scale))) {
                      n.series = j;
                      n.xaxis = j.xaxis;
                      n.yaxis = j.yaxis;
                      n.mouse = j.mouse;
                      n.x = e.x;
                      n.y = e.y;
                      n.dist = e.distance;
                      n.index = e.dataIndex;
                      n.seriesIndex = h
                  }
              }
          }
          if (!f || (f.index !== n.index || f.seriesIndex !== n.seriesIndex)) {
              this.hit.clearHit();
              if (n.series && n.mouse && n.mouse.track) {
                  this.hit.drawMouseTrack(n);
                  this.hit.drawHit(n);
                  Flotr.EventAdapter.fire(this.el, "flotr:hit", [n, this])
              }
          }
      },
      closest: function(r) {
          var q = this.series,
              f = this.options,
              w = r.relX,
              u = r.relY,
              E = Number.MAX_VALUE,
              h = Number.MAX_VALUE,
              s = {},
              k = {},
              C = false,
              t,
              D,
              g,
              B,
              A,
              m,
              l,
              p,
              o,
              z,
              v;
          function e(j) {
              j.distance = g;
              j.distanceX = B;
              j.distanceY = A;
              j.seriesIndex = z;
              j.dataIndex = v;
              j.x = p;
              j.y = o
          }
          for (z = 0; z < q.length; z++) {
              t = q[z];
              D = t.data;
              m = t.xaxis.p2d(w);
              l = t.yaxis.p2d(u);
              if (D.length) {
                  C = true
              }
              for (v = D.length; v--;) {
                  p = D[v][0];
                  o = D[v][1];
                  if (p === null || o === null) {
                      continue
                  }
                  if (p < t.xaxis.min || p > t.xaxis.max) {
                      continue
                  }
                  B = Math.abs(p - m);
                  A = Math.abs(o - l);
                  g = B * B + A * A;
                  if (g < E) {
                      E = g;
                      e(s)
                  }
                  if (B < h) {
                      h = B;
                      e(k)
                  }
              }
          }
          return C ? {
              point: s,
              x: k
          } : false
      },
      drawMouseTrack: function(l) {
          var v = "",
              B = l.series,
              g = l.mouse.position,
              q = l.mouse.margin,
              z = a,
              h = this.mouseTrack,
              j = this.plotOffset,
              o = j.left,
              w = j.right,
              f = j.bottom,
              u = j.top,
              k = l.mouse.trackDecimals,
              A = this.options;
          if (!h) {
              h = d.node('<div class="flotr-mouse-value"></div>');
              this.mouseTrack = h;
              d.insert(this.el, h)
          }
          if (!l.mouse.relative) {
              if (g.charAt(0) == "n") {
                  v += "top:" + (q + u) + "px;bottom:auto;"
              } else {
                  if (g.charAt(0) == "s") {
                      v += "bottom:" + (q + f) + "px;top:auto;"
                  }
              }
              if (g.charAt(1) == "e") {
                  v += "right:" + (q + w) + "px;left:auto;"
              } else {
                  if (g.charAt(1) == "w") {
                      v += "left:" + (q + o) + "px;right:auto;"
                  }
              }
          } else {
              if (B.bars.show) {
                  v += "bottom:" + (q - u - l.yaxis.d2p(l.y / 2) + this.canvasHeight) + "px;top:auto;";
                  v += "left:" + (q + o + l.xaxis.d2p(l.x - A.bars.barWidth / 2)) + "px;right:auto;"
              } else {
                  if (B.pie.show) {
                      var e = {
                              x: (this.plotWidth) / 2,
                              y: (this.plotHeight) / 2
                          },
                          t = (Math.min(this.canvasWidth, this.canvasHeight) * B.pie.sizeRatio) / 2,
                          r = l.sAngle < l.eAngle ? (l.sAngle + l.eAngle) / 2 : (l.sAngle + l.eAngle + 2 * Math.PI) / 2;
                      v += "bottom:" + (q - u - e.y - Math.sin(r) * t / 2 + this.canvasHeight) + "px;top:auto;";
                      v += "left:" + (q + o + e.x + Math.cos(r) * t / 2) + "px;right:auto;"
                  } else {
                      if (g.charAt(0) == "n") {
                          v += "bottom:" + (q - u - l.yaxis.d2p(l.y) + this.canvasHeight) + "px;top:auto;"
                      } else {
                          if (g.charAt(0) == "s") {
                              v += "top:" + (q + u + l.yaxis.d2p(l.y)) + "px;bottom:auto;"
                          }
                      }
                      if (g.charAt(1) == "e") {
                          v += "left:" + (q + o + l.xaxis.d2p(l.x)) + "px;right:auto;"
                      } else {
                          if (g.charAt(1) == "w") {
                              v += "right:" + (q - o - l.xaxis.d2p(l.x) + this.canvasWidth) + "px;left:auto;"
                          }
                      }
                  }
              }
          }
          z += v;
          h.style.cssText = z;
          if (!k || k < 0) {
              k = 0
          }
          h.innerHTML = l.mouse.trackFormatter({
              x: l.x.toFixed(k),
              y: l.y.toFixed(k),
              series: l.series,
              index: l.index,
              nearest: l,
              fraction: l.fraction
          });
          d.show(h)
      }
  })
})();
(function() {
  function b(h, g) {
      return ( h.which ? (h.which === 1) : (h.button === 0 || h.button === 1))
  }
  function a(g, h) {
      return Math.min(Math.max(0, g), h.plotWidth - 1)
  }
  function f(h, g) {
      return Math.min(Math.max(0, h), g.plotHeight)
  }
  var e = Flotr.DOM,
      d = Flotr.EventAdapter,
      c = Flotr._;
  Flotr.addPlugin("selection", {
      options: {
          pinchOnly: null,
          mode: null,
          color: "#B6D9FF",
          fps: 20
      },
      callbacks: {
          "flotr:mouseup": function(j) {
              var g = this.options.selection,
                  h = this.selection,
                  k = this.getEventPosition(j);
              if (!g || !g.mode) {
                  return
              }
              if (h.interval) {
                  clearInterval(h.interval)
              }
              if (this.multitouches) {
                  h.updateSelection()
              } else {
                  if (!g.pinchOnly) {
                      h.setSelectionPos(h.selection.second, k)
                  }
              }
              h.clearSelection();
              if (h.selecting && h.selectionIsSane()) {
                  h.drawSelection();
                  h.fireSelectEvent();
                  this.ignoreClick = true
              }
          },
          "flotr:mousedown": function(j) {
              var g = this.options.selection,
                  h = this.selection,
                  k = this.getEventPosition(j);
              if (!g || !g.mode) {
                  return
              }
              if (!g.mode || (!b(j) && c.isUndefined(j.touches))) {
                  return
              }
              if (!g.pinchOnly) {
                  h.setSelectionPos(h.selection.first, k)
              }
              if (h.interval) {
                  clearInterval(h.interval)
              }
              this.lastMousePos.pageX = null;
              h.selecting = false;
              h.interval = setInterval(c.bind(h.updateSelection, this), 1000 / g.fps)
          },
          "flotr:destroy": function(g) {
              clearInterval(this.selection.interval)
          }
      },
      getArea: function() {
          var h = this.selection.selection,
              j = h.first,
              g = h.second;
          return {
              x1: Math.min(j.x, g.x),
              x2: Math.max(j.x, g.x),
              y1: Math.min(j.y, g.y),
              y2: Math.max(j.y, g.y)
          }
      },
      selection: {
          first: {
              x: -1,
              y: -1
          },
          second: {
              x: -1,
              y: -1
          }
      },
      prevSelection: null,
      interval: null,
      fireSelectEvent: function(k) {
          var g = this.axes,
              o = this.selection.selection,
              j,
              h,
              m,
              l;
          k = k || "select";
          j = g.x.p2d(o.first.x);
          h = g.x.p2d(o.second.x);
          m = g.y.p2d(o.first.y);
          l = g.y.p2d(o.second.y);
          d.fire(this.el, "flotr:" + k, [{
              x1: Math.min(j, h),
              y1: Math.min(m, l),
              x2: Math.max(j, h),
              y2: Math.max(m, l),
              xfirst: j,
              xsecond: h,
              yfirst: m,
              ysecond: l
          }, this])
      },
      setSelection: function(h, o) {
          var r = this.options,
              g = this.axes.x,
              m = this.axes.y,
              j = m.scale,
              p = g.scale,
              l = r.selection.mode.indexOf("x") != -1,
              k = r.selection.mode.indexOf("y") != -1,
              q = this.selection.selection;
          this.selection.clearSelection();
          q.first.y = f((l && !k) ? 0 : (m.max - h.y1) * j, this);
          q.second.y = f((l && !k) ? this.plotHeight - 1 : (m.max - h.y2) * j, this);
          q.first.x = a((k && !l) ? 0 : h.x1, this);
          q.second.x = a((k && !l) ? this.plotWidth : h.x2, this);
          this.selection.drawSelection();
          if (!o) {
              this.selection.fireSelectEvent()
          }
      },
      setSelectionPos: function(k, j) {
          var h = this.options.selection.mode,
              g = this.selection.selection;
          if (h.indexOf("x") == -1) {
              k.x = (k == g.first) ? 0 : this.plotWidth
          } else {
              k.x = a(j.relX, this)
          }
          if (h.indexOf("y") == -1) {
              k.y = (k == g.first) ? 0 : this.plotHeight - 1
          } else {
              k.y = f(j.relY, this)
          }
      },
      drawSelection: function() {
          this.selection.fireSelectEvent("selecting");
          var q = this.selection.selection,
              p = this.octx,
              r = this.options,
              g = this.plotOffset,
              k = this.selection.prevSelection;
          if (k && q.first.x == k.first.x && q.first.y == k.first.y && q.second.x == k.second.x && q.second.y == k.second.y) {
              return
          }
          p.save();
          p.strokeStyle = this.processColor(r.selection.color, {
              opacity: 0.8
          });
          p.lineWidth = 1;
          p.lineJoin = "miter";
          p.fillStyle = this.processColor(r.selection.color, {
              opacity: 0.4
          });
          this.selection.prevSelection = {
              first: {
                  x: q.first.x,
                  y: q.first.y
              },
              second: {
                  x: q.second.x,
                  y: q.second.y
              }
          };
          var m = Math.min(q.first.x, q.second.x),
              l = Math.min(q.first.y, q.second.y),
              o = Math.abs(q.second.x - q.first.x),
              j = Math.abs(q.second.y - q.first.y);
          p.fillRect(m + g.left + 0.5, l + g.top + 0.5, o, j);
          p.strokeRect(m + g.left + 0.5, l + g.top + 0.5, o, j);
          p.restore()
      },
      updateSelection: function() {
          if (!this.lastMousePos.pageX) {
              return
          }
          this.selection.selecting = true;
          if (this.multitouches) {
              this.selection.setSelectionPos(this.selection.selection.first, this.getEventPosition(this.multitouches[0]));
              this.selection.setSelectionPos(this.selection.selection.second, this.getEventPosition(this.multitouches[1]))
          } else {
              if (this.options.selection.pinchOnly) {
                  return
              } else {
                  this.selection.setSelectionPos(this.selection.selection.second, this.lastMousePos)
              }
          }
          this.selection.clearSelection();
          if (this.selection.selectionIsSane()) {
              this.selection.drawSelection()
          }
      },
      clearSelection: function() {
          if (!this.selection.prevSelection) {
              return
          }
          var p = this.selection.prevSelection,
              m = 1,
              k = this.plotOffset,
              g = Math.min(p.first.x, p.second.x),
              o = Math.min(p.first.y, p.second.y),
              j = Math.abs(p.second.x - p.first.x),
              l = Math.abs(p.second.y - p.first.y);
          this.octx.clearRect(g + k.left - m + 0.5, o + k.top - m, j + 2 * m + 0.5, l + 2 * m + 0.5);
          this.selection.prevSelection = null
      },
      selectionIsSane: function() {
          var g = this.selection.selection;
          return Math.abs(g.second.x - g.first.x) >= 5 || Math.abs(g.second.y - g.first.y) >= 5
      }
  })
})();
(function() {
  var a = Flotr.DOM;
  Flotr.addPlugin("labels", {
      callbacks: {
          "flotr:afterdraw": function() {
              this.labels.draw()
          }
      },
      draw: function() {
          var d,
              s,
              g,
              m,
              p,
              f,
              v,
              b,
              u,
              k,
              r,
              j = "",
              c = 0,
              e = this.options,
              q = this.ctx,
              w = this.axes,
              t = {
                  size: e.fontSize
              };
          for (r = 0; r < w.x.ticks.length; ++r) {
              if (w.x.ticks[r].label) {
                  ++c
              }
          }
          p = this.plotWidth / c;
          if (e.grid.circular) {
              q.save();
              q.translate(this.plotOffset.left + this.plotWidth / 2, this.plotOffset.top + this.plotHeight / 2);
              f = this.plotHeight * e.radar.radiusRatio / 2 + e.fontSize;
              v = this.axes.x.ticks.length;
              b = 2 * (Math.PI / v);
              u = -Math.PI / 2;
              h(this, w.x, false);
              h(this, w.x, true);
              h(this, w.y, false);
              h(this, w.y, true);
              q.restore()
          }
          if (!e.HtmlText && this.textEnabled) {
              o(this, w.x, "center", "top");
              o(this, w.x2, "center", "bottom");
              o(this, w.y, "right", "middle");
              o(this, w.y2, "left", "middle")
          } else {
              if ((w.x.options.showLabels || w.x2.options.showLabels || w.y.options.showLabels || w.y2.options.showLabels) && !e.grid.circular) {
                  j = "";
                  l(this, w.x);
                  l(this, w.x2);
                  l(this, w.y);
                  l(this, w.y2);
                  q.stroke();
                  q.restore();
                  k = a.create("div");
                  a.setStyles(k, {
                      fontSize: "smaller",
                      color: e.grid.color
                  });
                  k.className = "flotr-labels";
                  a.insert(this.el, k);
                  a.insert(k, j)
              }
          }
          function h(F, C, A) {
              var D = A ? C.minorTicks : C.ticks,
                  E = C.orientation === 1,
                  z = C.n === 1,
                  B,
                  G;
              B = {
                  color: C.options.color || e.grid.color,
                  angle: Flotr.toRad(C.options.labelsAngle),
                  textBaseline: "middle"
              };
              for (r = 0; r < D.length && (A ? C.options.showMinorLabels : C.options.showLabels); ++r) {
                  s = D[r];
                  s.label += "";
                  if (!s.label || !s.label.length) {
                      continue
                  }
                  x = Math.cos(r * b + u) * f;
                  y = Math.sin(r * b + u) * f;
                  B.textAlign = E ? (Math.abs(x) < 0.1 ? "center" : (x < 0 ? "right" : "left")) : "left";
                  Flotr.drawText(q, s.label, E ? x : 3, E ? y : -(C.ticks[r].v / C.max) * (f - e.fontSize), B)
              }
          }
          function o(I, D, C, B) {
              var J = D.orientation === 1,
                  F = D.n === 1,
                  z,
                  E;
              z = {
                  color: D.options.color || e.grid.color,
                  textAlign: C,
                  textBaseline: B,
                  angle: Flotr.toRad(D.options.labelsAngle)
              };
              z = Flotr.getBestTextAlign(z.angle, z);
              for (r = 0; r < D.ticks.length && H(D); ++r) {
                  s = D.ticks[r];
                  if (!s.label || !s.label.length) {
                      continue
                  }
                  E = D.d2p(s.v);
                  if (E < 0 || E > (J ? I.plotWidth : I.plotHeight)) {
                      continue
                  }
                  Flotr.drawText(q, s.label, A(I, J, F, E), G(I, J, F, E), z);
                  if (!J && !F) {
                      q.save();
                      q.strokeStyle = z.color;
                      q.beginPath();
                      q.moveTo(I.plotOffset.left + I.plotWidth - 8, I.plotOffset.top + D.d2p(s.v));
                      q.lineTo(I.plotOffset.left + I.plotWidth, I.plotOffset.top + D.d2p(s.v));
                      q.stroke();
                      q.restore()
                  }
              }
              function H(K) {
                  return K.options.showLabels && K.used
              }
              function A(M, L, K, N) {
                  return M.plotOffset.left + (L ? N : (K ? -e.grid.labelMargin : e.grid.labelMargin + M.plotWidth))
              }
              function G(M, L, K, N) {
                  return M.plotOffset.top + (L ? e.grid.labelMargin : N) + ((L && K) ? M.plotHeight : 0)
              }
          }
          function l(G, C) {
              var H = C.orientation === 1,
                  E = C.n === 1,
                  A = "",
                  B,
                  z,
                  F,
                  D = G.plotOffset;
              if (!H && !E) {
                  q.save();
                  q.strokeStyle = C.options.color || e.grid.color;
                  q.beginPath()
              }
              if (C.options.showLabels && (E ? true : C.used)) {
                  for (r = 0; r < C.ticks.length; ++r) {
                      s = C.ticks[r];
                      if (!s.label || !s.label.length || ((H ? D.left : D.top) + C.d2p(s.v) < 0) || ((H ? D.left : D.top) + C.d2p(s.v) > (H ? G.canvasWidth : G.canvasHeight))) {
                          continue
                      }
                      F = D.top + (H ? ((E ? 1 : -1) * (G.plotHeight + e.grid.labelMargin)) : C.d2p(s.v) - C.maxLabel.height / 2);
                      B = H ? (D.left + C.d2p(s.v) - p / 2) : 0;
                      A = "";
                      if (r === 0) {
                          A = " first"
                      } else {
                          if (r === C.ticks.length - 1) {
                              A = " last"
                          }
                      }
                      A += H ? " flotr-grid-label-x" : " flotr-grid-label-y";
                      j += ['<div style="position:absolute; text-align:' + (H ? "center" : "right") + "; ", "top:" + F + "px; ", ((!H && !E) ? "right:" : "left:") + B + "px; ", "width:" + (H ? p : ((E ? D.left : D.right) - e.grid.labelMargin)) + "px; ", C.options.color ? ("color:" + C.options.color + "; ") : " ", '" class="flotr-grid-label' + A + '">' + s.label + "</div>"].join(" ");
                      if (!H && !E) {
                          q.moveTo(D.left + G.plotWidth - 8, D.top + C.d2p(s.v));
                          q.lineTo(D.left + G.plotWidth, D.top + C.d2p(s.v))
                      }
                  }
              }
          }
      }
  })
})();
(function() {
  var b = Flotr.DOM,
      a = Flotr._;
  Flotr.addPlugin("legend", {
      options: {
          show: true,
          noColumns: 1,
          labelFormatter: function(c) {
              return c
          },
          labelBoxBorderColor: "#CCCCCC",
          labelBoxWidth: 14,
          labelBoxHeight: 10,
          labelBoxMargin: 5,
          labelBoxOpacity: 0.4,
          container: null,
          position: "nw",
          margin: 5,
          backgroundColor: null,
          backgroundOpacity: 0.85
      },
      callbacks: {
          "flotr:afterinit": function() {
              this.legend.insertLegend()
          }
      },
      insertLegend: function() {
          if (!this.options.legend.show) {
              return
          }
          var u = this.series,
              v = this.plotOffset,
              h = this.options,
              e = h.legend,
              R = [],
              f = false,
              F = this.ctx,
              N = a.filter(u, function(c) {
                  return ( c.label && !c.hide)
              }).length,
              D = e.position,
              E = e.margin,
              H,
              l,
              G;
          if (N) {
              if (!h.HtmlText && this.textEnabled && !e.container) {
                  var J = {
                      size: h.fontSize * 1.1,
                      color: h.grid.color
                  };
                  var B = e.labelBoxWidth,
                      Q = e.labelBoxHeight,
                      I = e.labelBoxMargin,
                      M = v.left + E,
                      K = v.top + E;
                  var P = 0;
                  for (H = u.length - 1; H > -1; --H) {
                      if (!u[H].label || u[H].hide) {
                          continue
                      }
                      l = e.labelFormatter(u[H].label);
                      P = Math.max(P, this._text.measureText(l, J).width)
                  }
                  var A = Math.round(B + I * 3 + P),
                      j = Math.round(N * (I + Q) + I);
                  if (D.charAt(0) == "s") {
                      K = v.top + this.plotHeight - (E + j)
                  }
                  if (D.charAt(1) == "e") {
                      M = v.left + this.plotWidth - (E + A)
                  }
                  G = this.processColor(e.backgroundColor || "rgb(240,240,240)", {
                      opacity: e.backgroundOpacity || 0.1
                  });
                  F.fillStyle = G;
                  F.fillRect(M, K, A, j);
                  F.strokeStyle = e.labelBoxBorderColor;
                  F.strokeRect(Flotr.toPixel(M), Flotr.toPixel(K), A, j);
                  var t = M + I;
                  var r = K + I;
                  for (H = 0; H < u.length; H++) {
                      if (!u[H].label || u[H].hide) {
                          continue
                      }
                      l = e.labelFormatter(u[H].label);
                      F.fillStyle = u[H].color;
                      F.fillRect(t, r, B - 1, Q - 1);
                      F.strokeStyle = e.labelBoxBorderColor;
                      F.lineWidth = 1;
                      F.strokeRect(Math.ceil(t) - 1.5, Math.ceil(r) - 1.5, B + 2, Q + 2);
                      Flotr.drawText(F, l, t + B + I, r + Q, J);
                      r += Q + I
                  }
              } else {
                  for (H = 0; H < u.length; ++H) {
                      if (!u[H].label || u[H].hide) {
                          continue
                      }
                      if (H % e.noColumns === 0) {
                          R.push(f ? "</tr><tr>" : "<tr>");
                          f = true
                      }
                      var z = u[H],
                          q = e.labelBoxWidth,
                          k = e.labelBoxHeight,
                          d = (z.bars ? z.bars.fillOpacity : e.labelBoxOpacity),
                          g = "opacity:" + d + ";filter:alpha(opacity=" + d * 100 + ");";
                      l = e.labelFormatter(z.label);
                      G = "background-color:" + ((z.bars && z.bars.show && z.bars.fillColor && z.bars.fill) ? z.bars.fillColor : z.color) + ";";
                      R.push('<td class="flotr-legend-color-box">', '<div style="border:1px solid ', e.labelBoxBorderColor, ';padding:1px">', '<div style="width:', (q - 1), "px;height:", (k - 1), "px;border:1px solid ", u[H].color, '">', '<div style="width:', q, "px;height:", k, "px;", "opacity:.4;", G, '"></div>', "</div>", "</div>", "</td>", '<td class="flotr-legend-label">', l, "</td>")
                  }
                  if (f) {
                      R.push("</tr>")
                  }
                  if (R.length > 0) {
                      var L = '<table style="font-size:smaller;color:' + h.grid.color + '">' + R.join("") + "</table>";
                      if (e.container) {
                          b.insert(e.container, L)
                      } else {
                          var o = {
                              position: "absolute",
                              "z-index": 2
                          };
                          if (D.charAt(0) == "n") {
                              o.top = (E + v.top) + "px";
                              o.bottom = "auto"
                          } else {
                              if (D.charAt(0) == "s") {
                                  o.bottom = (E + v.bottom) + "px";
                                  o.top = "auto"
                              }
                          }
                          if (D.charAt(1) == "e") {
                              o.right = (E + v.right) + "px";
                              o.left = "auto"
                          } else {
                              if (D.charAt(1) == "w") {
                                  o.left = (E + v.left) + "px";
                                  o.right = "auto"
                              }
                          }
                          var w = b.create("div"),
                              C;
                          w.className = "flotr-legend";
                          b.setStyles(w, o);
                          b.insert(w, L);
                          b.insert(this.el, w);
                          if (!e.backgroundOpacity) {
                              return
                          }
                          var O = e.backgroundColor || h.grid.backgroundColor || "#ffffff";
                          a.extend(o, b.size(w), {
                              backgroundColor: O,
                              "z-index": 1
                          });
                          o.width += "px";
                          o.height += "px";
                          w = b.create("div");
                          w.className = "flotr-legend-bg";
                          b.setStyles(w, o);
                          b.opacity(w, e.backgroundOpacity);
                          b.insert(w, " ");
                          b.insert(this.el, w)
                      }
                  }
              }
          }
      }
  })
})();
(function() {
  function b(e) {
      if (this.options.spreadsheet.tickFormatter) {
          return this.options.spreadsheet.tickFormatter(e)
      } else {
          var d = a.find(this.axes.x.ticks, function(f) {
              return f.v == e
          });
          if (d) {
              return d.label
          }
          return e
      }
  }
  var c = Flotr.DOM,
      a = Flotr._;
  Flotr.addPlugin("spreadsheet", {
      options: {
          show: false,
          tabGraphLabel: "Graph",
          tabDataLabel: "Data",
          toolbarDownload: "Download CSV",
          toolbarSelectAll: "Select all",
          csvFileSeparator: ",",
          decimalSeparator: ".",
          tickFormatter: null,
          initialTab: "graph"
      },
      callbacks: {
          "flotr:afterconstruct": function() {
              if (!this.options.spreadsheet.show) {
                  return
              }
              var e = this.spreadsheet,
                  d = c.node('<div class="flotr-tabs-group" style="position:absolute;left:0px;width:' + this.canvasWidth + 'px"></div>'),
                  g = c.node('<div style="float:left" class="flotr-tab selected">' + this.options.spreadsheet.tabGraphLabel + "</div>"),
                  f = c.node('<div style="float:left" class="flotr-tab">' + this.options.spreadsheet.tabDataLabel + "</div>"),
                  h;
              e.tabsContainer = d;
              e.tabs = {
                  graph: g,
                  data: f
              };
              c.insert(d, g);
              c.insert(d, f);
              c.insert(this.el, d);
              h = c.size(f).height + 2;
              this.plotOffset.bottom += h;
              c.setStyles(d, {
                  top: this.canvasHeight - h + "px"
              });
              this.observe(g, "click", function() {
                  e.showTab("graph")
              }).observe(f, "click", function() {
                  e.showTab("data")
              });
              if (this.options.spreadsheet.initialTab !== "graph") {
                  e.showTab(this.options.spreadsheet.initialTab)
              }
          }
      },
      loadDataGrid: function() {
          if (this.seriesData) {
              return this.seriesData
          }
          var d = this.series,
              e = {};
          a.each(d, function(g, f) {
              a.each(g.data, function(j) {
                  var h = j[0],
                      m = j[1],
                      l = e[h];
                  if (l) {
                      l[f + 1] = m
                  } else {
                      var k = [];
                      k[0] = h;
                      k[f + 1] = m;
                      e[h] = k
                  }
              })
          });
          this.seriesData = a.sortBy(e, function(g, f) {
              return parseInt(f, 10)
          });
          return this.seriesData
      },
      constructDataGrid: function() {
          if (this.spreadsheet.datagrid) {
              return this.spreadsheet.datagrid
          }
          var o = this.series,
              k = this.spreadsheet.loadDataGrid(),
              e = ["<colgroup><col />"],
              h,
              g,
              l;
          var f = ['<table class="flotr-datagrid"><tr class="first-row">'];
          f.push("<th>&nbsp;</th>");
          a.each(o, function(q, p) {
              f.push('<th scope="col">' + (q.label || String.fromCharCode(65 + p)) + "</th>");
              e.push("<col />")
          });
          f.push("</tr>");
          a.each(k, function(p) {
              f.push("<tr>");
              a.times(o.length + 1, function(s) {
                  var q = "td",
                      u = p[s],
                      t = (!a.isUndefined(u) ? Math.round(u * 100000) / 100000 : "");
                  if (s === 0) {
                      q = "th";
                      var r = b.call(this, t);
                      if (r) {
                          t = r
                      }
                  }
                  f.push("<" + q + (q == "th" ? ' scope="row"' : "") + ">" + t + "</" + q + ">")
              }, this);
              f.push("</tr>")
          }, this);
          e.push("</colgroup>");
          l = c.node(f.join(""));
          h = c.node('<button type="button" class="flotr-datagrid-toolbar-button">' + this.options.spreadsheet.toolbarDownload + "</button>");
          g = c.node('<button type="button" class="flotr-datagrid-toolbar-button">' + this.options.spreadsheet.toolbarSelectAll + "</button>");
          this.observe(h, "click", a.bind(this.spreadsheet.downloadCSV, this)).observe(g, "click", a.bind(this.spreadsheet.selectAllData, this));
          var j = c.node('<div class="flotr-datagrid-toolbar"></div>');
          c.insert(j, h);
          c.insert(j, g);
          var m = this.canvasHeight - c.size(this.spreadsheet.tabsContainer).height - 2,
              d = c.node('<div class="flotr-datagrid-container" style="position:absolute;left:0px;top:0px;width:' + this.canvasWidth + "px;height:" + m + 'px;overflow:auto;z-index:10"></div>');
          c.insert(d, j);
          c.insert(d, l);
          c.insert(this.el, d);
          this.spreadsheet.datagrid = l;
          this.spreadsheet.container = d;
          return l
      },
      showTab: function(d) {
          if (this.spreadsheet.activeTab === d) {
              return
          }
          switch (d) {
          case "graph":
              c.hide(this.spreadsheet.container);
              c.removeClass(this.spreadsheet.tabs.data, "selected");
              c.addClass(this.spreadsheet.tabs.graph, "selected");
              break;
          case "data":
              if (!this.spreadsheet.datagrid) {
                  this.spreadsheet.constructDataGrid()
              }
              c.show(this.spreadsheet.container);
              c.addClass(this.spreadsheet.tabs.data, "selected");
              c.removeClass(this.spreadsheet.tabs.graph, "selected");
              break;
          default:
              throw "Illegal tab name: " + d
          }
          this.spreadsheet.activeTab = d
      },
      selectAllData: function() {
          if (this.spreadsheet.tabs) {
              var e,
                  d,
                  h,
                  g,
                  f = this.spreadsheet.constructDataGrid();
              this.spreadsheet.showTab("data");
              setTimeout(function() {
                  if ((h = f.ownerDocument) && (g = h.defaultView) && g.getSelection && h.createRange && (e = window.getSelection()) && e.removeAllRanges) {
                      d = h.createRange();
                      d.selectNode(f);
                      e.removeAllRanges();
                      e.addRange(d)
                  } else {
                      if (document.body && document.body.createTextRange && (d = document.body.createTextRange())) {
                          d.moveToElementText(f);
                          d.select()
                      }
                  }
              }, 0);
              return true
          } else {
              return false
          }
      },
      downloadCSV: function() {
          var d = "",
              f = this.series,
              e = this.options,
              h = this.spreadsheet.loadDataGrid(),
              g = encodeURIComponent(e.spreadsheet.csvFileSeparator);
          if (e.spreadsheet.decimalSeparator === e.spreadsheet.csvFileSeparator) {
              throw "The decimal separator is the same as the column separator (" + e.spreadsheet.decimalSeparator + ")"
          }
          a.each(f, function(k, j) {
              d += g + '"' + (k.label || String.fromCharCode(65 + j)).replace(/\"/g, '\\"') + '"'
          });
          d += "%0D%0A";
          d += a.reduce(h, function(k, l) {
              var m = b.call(this, l[0]) || "";
              m = '"' + (m + "").replace(/\"/g, '\\"') + '"';
              var j = l.slice(1).join(g);
              if (e.spreadsheet.decimalSeparator !== ".") {
                  j = j.replace(/\./g, e.spreadsheet.decimalSeparator)
              }
              return k + m + g + j + "%0D%0A"
          }, "", this);
          if (Flotr.isIE && Flotr.isIE < 9) {
              d = d.replace(new RegExp(g, "g"), decodeURIComponent(g)).replace(/%0A/g, "\n").replace(/%0D/g, "\r");
              window.open().document.write(d)
          } else {
              window.open("data:text/csv," + d)
          }
      }
  })
})();
(function() {
  var a = Flotr.DOM;
  Flotr.addPlugin("titles", {
      callbacks: {
          "flotr:afterdraw": function() {
              this.titles.drawTitles()
          }
      },
      drawTitles: function() {
          var e,
              d = this.options,
              g = d.grid.labelMargin,
              c = this.ctx,
              b = this.axes;
          if (!d.HtmlText && this.textEnabled) {
              var f = {
                  size: d.fontSize,
                  color: d.grid.color,
                  textAlign: "center"
              };
              if (d.subtitle) {
                  Flotr.drawText(c, d.subtitle, this.plotOffset.left + this.plotWidth / 2, this.titleHeight + this.subtitleHeight - 2, f)
              }
              f.weight = 1.5;
              f.size *= 1.5;
              if (d.title) {
                  Flotr.drawText(c, d.title, this.plotOffset.left + this.plotWidth / 2, this.titleHeight - 2, f)
              }
              f.weight = 1.8;
              f.size *= 0.8;
              if (b.x.options.title && b.x.used) {
                  f.textAlign = b.x.options.titleAlign || "center";
                  f.textBaseline = "top";
                  f.angle = Flotr.toRad(b.x.options.titleAngle);
                  f = Flotr.getBestTextAlign(f.angle, f);
                  Flotr.drawText(c, b.x.options.title, this.plotOffset.left + this.plotWidth / 2, this.plotOffset.top + b.x.maxLabel.height + this.plotHeight + 2 * g, f)
              }
              if (b.x2.options.title && b.x2.used) {
                  f.textAlign = b.x2.options.titleAlign || "center";
                  f.textBaseline = "bottom";
                  f.angle = Flotr.toRad(b.x2.options.titleAngle);
                  f = Flotr.getBestTextAlign(f.angle, f);
                  Flotr.drawText(c, b.x2.options.title, this.plotOffset.left + this.plotWidth / 2, this.plotOffset.top - b.x2.maxLabel.height - 2 * g, f)
              }
              if (b.y.options.title && b.y.used) {
                  f.textAlign = b.y.options.titleAlign || "right";
                  f.textBaseline = "middle";
                  f.angle = Flotr.toRad(b.y.options.titleAngle);
                  f = Flotr.getBestTextAlign(f.angle, f);
                  Flotr.drawText(c, b.y.options.title, this.plotOffset.left - b.y.maxLabel.width - 2 * g, this.plotOffset.top + this.plotHeight / 2, f)
              }
              if (b.y2.options.title && b.y2.used) {
                  f.textAlign = b.y2.options.titleAlign || "left";
                  f.textBaseline = "middle";
                  f.angle = Flotr.toRad(b.y2.options.titleAngle);
                  f = Flotr.getBestTextAlign(f.angle, f);
                  Flotr.drawText(c, b.y2.options.title, this.plotOffset.left + this.plotWidth + b.y2.maxLabel.width + 2 * g, this.plotOffset.top + this.plotHeight / 2, f)
              }
          } else {
              e = [];
              if (d.title) {
                  e.push('<div style="position:absolute;top:0;left:', this.plotOffset.left, "px;font-size:1em;font-weight:bold;text-align:center;width:", this.plotWidth, 'px;" class="flotr-title">', d.title, "</div>")
              }
              if (d.subtitle) {
                  e.push('<div style="position:absolute;top:', this.titleHeight, "px;left:", this.plotOffset.left, "px;font-size:smaller;text-align:center;width:", this.plotWidth, 'px;" class="flotr-subtitle">', d.subtitle, "</div>")
              }
              e.push("</div>");
              e.push('<div class="flotr-axis-title" style="font-weight:bold;">');
              if (b.x.options.title && b.x.used) {
                  e.push('<div style="position:absolute;top:', (this.plotOffset.top + this.plotHeight + d.grid.labelMargin + b.x.titleSize.height), "px;left:", this.plotOffset.left, "px;width:", this.plotWidth, "px;text-align:", b.x.options.titleAlign, ';" class="flotr-axis-title flotr-axis-title-x1">', b.x.options.title, "</div>")
              }
              if (b.x2.options.title && b.x2.used) {
                  e.push('<div style="position:absolute;top:0;left:', this.plotOffset.left, "px;width:", this.plotWidth, "px;text-align:", b.x2.options.titleAlign, ';" class="flotr-axis-title flotr-axis-title-x2">', b.x2.options.title, "</div>")
              }
              if (b.y.options.title && b.y.used) {
                  e.push('<div style="position:absolute;top:', (this.plotOffset.top + this.plotHeight / 2 - b.y.titleSize.height / 2), "px;left:0;text-align:", b.y.options.titleAlign, ';" class="flotr-axis-title flotr-axis-title-y1">', b.y.options.title, "</div>")
              }
              if (b.y2.options.title && b.y2.used) {
                  e.push('<div style="position:absolute;top:', (this.plotOffset.top + this.plotHeight / 2 - b.y.titleSize.height / 2), "px;right:0;text-align:", b.y2.options.titleAlign, ';" class="flotr-axis-title flotr-axis-title-y2">', b.y2.options.title, "</div>")
              }
              e = e.join("");
              var h = a.create("div");
              a.setStyles({
                  color: d.grid.color
              });
              h.className = "flotr-titles";
              a.insert(this.el, h);
              a.insert(h, e)
          }
      }
  })
})();

