const prepHateoasProductos = (data, page, allProducts) => {
  page = parseInt(page);
  const results = data.map((item) => {
    const fecha = item.fecha.toISOString().split("T")[0];
    return {
      ...item,
      fecha: fecha,
    };
  });
  const totalPerPage = results.length;
  const total = allProducts.length;
  const DisminuirPage = (page) => {
    if (page > 1) {
      return page - 1;
    } else {
      return page;
    }
  };
  const AumentarPage = (page) => {
    if (totalPerPage < 12) {
      return page;
    } else {
      return page + 1;
    }
  };
  const HATEOAS = {
    productos_total: total,
    productos_total_pagina: totalPerPage,
    siguiente_pagina: `/productos?page=${AumentarPage(page)}`,
    anterior_pagina: `/productos?page=${DisminuirPage(page)}`,
    results,
  };
  return HATEOAS;
};

const prepHateoasCategorias = (data, page, categoria, allProducts) => {
  page = parseInt(page);

  const results = data.map((item) => {
    const fecha = item.fecha.toISOString().split("T")[0];
    return {
      ...item,
      fecha: fecha,
    };
  });
  const totalPerPage = results.length;
  const total = allProducts.length;
  const DisminuirPage = (page) => {
    if (page > 1) {
      return page - 1;
    } else {
      return page;
    }
  };
  const AumentarPage = (page) => {
    if (totalPerPage < 12) {
      return page;
    } else {
      return page + 1;
    }
  };
  const HATEOAS = {
    productos_totales: total,
    productos_totales_pagina: totalPerPage,
    siguiente_pagina: `/categorias/${categoria}?page=${AumentarPage(page)}`,
    anterior_pagina: `/categorias/${categoria}?page=${DisminuirPage(page)}`,
    results,
  };
  return HATEOAS;
};

const hateoasOrdersByUser = (ventas, page, totalResult) => {
  page = parseInt(page);
  let total = parseInt(totalResult[0].total);

  const results = ventas.map((venta) => {
    return {
      id: venta.id,
      comprador_id: venta.comprador_id,
      producto_id: venta.producto_id,
      nombre: venta.nombre,
      descripcion: venta.descripcion,
      imagen: venta.imagen,
      nombre_categoria: venta.nombre_categoria,
      cantidad: venta.cantidad,
      valor_total: venta.valor_total,
      fecha_venta: venta.fecha_venta.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }),
    };
  });
  const totalPerPage = results.length;

  const nextPage = (page) => {
    if (page > 5) {
      return page;
    } else {
      return page + 1;
    }
  };

  const prevPage = (page) => {
    if (page > 1) {
      return page - 1;
    } else {
      return page;
    }
  };

  const HATEOAS = {
    total_por_pagina: totalPerPage,
    count: total,
    siguiente_pagina: `/productos?page=${nextPage(page)}`,
    anterior_pagina: `/productos?page=${prevPage(page)}`,
    results: results,
  };

  return HATEOAS;
};

export const hateoasModel = {
  prepHateoasProductos,
  prepHateoasCategorias,
  hateoasOrdersByUser,
};
