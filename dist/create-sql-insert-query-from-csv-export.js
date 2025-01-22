function g(o, c) {
  return o >= c[0] && o <= c[1];
}
function j(o, c) {
  const u = [];
  for (let p = 0; p < o.length; p += c)
    u.push(o.slice(p, p + c));
  return u;
}
function q({
  csvData: o,
  tableName: c,
  tableColumns: u,
  removeHeader: p = !0,
  skipRowIfNullableCols: R = {},
  replaceColIfNullable: m = {}
}) {
  const a = '"', h = "NULL";
  let d = "INSERT INTO " + c + " (" + u.map((t) => `"${t}"`).join(", ") + `) VALUES
	`;
  function y(t) {
    return t === h || !(t.startsWith(a) && t.endsWith(a)) ? t : `'${t.slice(1, -1)}'`;
  }
  function A(t) {
    const f = [...t.matchAll(",")].map((s) => s.index), e = [...t.matchAll(a)].map((s) => s.index), r = j(e, 2);
    return f.filter((s) => !r.some((n) => n.length === 2 ? g(s, n) : !1));
  }
  function I(t) {
    const f = t.split(",").map((e) => e.trim());
    if (f.length !== u.length) {
      const e = [-1].concat(A(t)), r = [];
      for (const [s, n] of e.entries()) {
        const i = e == null ? void 0 : e[s + 1], l = t.slice(n + 1, i);
        r.push(l);
      }
      return r;
    }
    return f;
  }
  const x = o.trim().split(`
`);
  p && x.shift();
  const N = x.reduce((t, f) => {
    const e = I(f), r = u.reduce((n, i, l) => {
      const S = String((e == null ? void 0 : e[l]) ?? h);
      return Object.hasOwn(m, i) && S.toUpperCase() === h ? n[i] = m[i] : n[i] = S, n;
    }, {}), s = Object.keys(R);
    return s.length > 0 && s.some((i) => ((r == null ? void 0 : r[i]) ?? h).toUpperCase() === h) || t.push("(" + u.map((n) => y(r[n])).join(", ") + ")"), t;
  }, []);
  return d = d + N.join(`,
	`) + ";", d;
}
export {
  q as default
};
