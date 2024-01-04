!(function () {
  function IndexViewModel() {
    var self = this;

    self.page = ko.observable(1);
    self.next = ko.observable(0);
    self.total = ko.observable(0);
    self.size = ko.observable(10);

    self.products = ko.observableArray([]);
    self.pagination = ko.observableArray([1]);

    self.id = ko.observable();
    self.code = ko.observable();
    self.name = ko.observable();
    self.price = ko.observable();
    self.description = ko.observable();

    self.modal = ko.observable(
      new bootstrap.Modal("#productModal", {
        backdrop: "static",
      })
    );

    self.api = axios.default.create({
      baseURL: `${location.protocol}//${location.host}/api`,
    });

    self.api.defaults.headers.common["Authorization"] =
      localStorage.getItem("access_token") || null;

    self.init = async function () {
      try {
        const productResponse = await self.api.get(
          `/products?page=${self.page()}&pageSize=${self.size()}`
        );

        const { data: products, total, next } = productResponse.data;

        self.products(products);
        self.next(next);
        self.total(total);
        self.pagination([1]);
        for (let i = 2; i <= total; i++) {
          self.pagination.push(i);
        }
      } catch (error) {
        console.log(error.response || error);
        if (error.response && error.response.status === 401) {
          location.href = "./login";
          return;
        }
      }
    };

    self.setPage = function (page, event) {
      self.page(page);
      self.init();
    };

    self.setSize = function (vm, event) {
      console.log(vm, event);
      self.size(event.target.value);
      self.init();
    };

    self.resetForm = function () {
      self.id(null);
      self.name(null);
      self.code(null);
      self.description(null);
      self.price(null);
    };

    self.saveProduct = async function () {
      try {
        if (!!self.id()) {
          return self.updateProduct();
        }
        await self.api.post(`/products`, {
          name: self.name(),
          code: self.code(),
          description: self.description(),
          price: self.price(),
        });
        location.reload();
      } catch (error) {
        console.log(error.response || error);
        if (error.response && error.response.status === 401) {
          location.href = "./login";
          return;
        }
      }
    };

    self.product = function (product, event) {
      try {
        console.log(product, event);
        self.id(product.id);
        self.name(product.name);
        self.code(product.code);
        self.description(product.description);
        self.price(product.price);

        const modal = new bootstrap.Modal("#productModal", {
          backdrop: "static",
        });
        modal.show();

        modal.addEventListener("hidden.bs.modal", (event) => {
          self.resetForm();
        });
      } catch (error) {
        console.log(error.response || error);
      }
    };

    self.updateProduct = async function () {
      try {
        await self.api.put(`/products/${self.id()}`, {
          name: self.name(),
          code: self.code(),
          description: self.description(),
          price: self.price(),
        });
        location.reload();
      } catch (error) {
        console.log(error.response || error);
        if (error.response && error.response.status === 401) {
          location.href = "./login";
          return;
        }
      }
    };

    self.deleteProduct = async function (product, event) {
      try {
        const data = self.products().find((p) => p.id === product.id);
        await self.api.delete(`/products/${data.id}`);
        location.reload();
      } catch (error) {
        console.log(error.response || error);
        if (error.response && error.response.status === 401) {
          location.href = "./login";
          return;
        }
      }
    };
  }
  var viewmodel = new IndexViewModel();
  viewmodel.init();
  ko.applyBindings(viewmodel, document.getElementById("content"));
})();
