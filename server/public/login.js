!(function () {
  function LoginViewModel() {
    var self = this;

    self.email = ko.observable();
    self.password = ko.observable();

    self.api = axios.default.create({
      baseURL: `${location.protocol}//${location.host}/auth`,
    });

    self.api.defaults.headers.common["Authorization"] =
      localStorage.getItem("access_token") || null;

    self.login = async function () {
      try {
        const authResponse = await self.api.post("/login", {
          email: self.email(),
          password: self.password(),
        });

        const { accessToken } = authResponse.data;

        localStorage.setItem("access_token", accessToken);
        location.href = "./";
      } catch (error) {
        console.log(error.response || error);
        if (error.response && error.response.status === 401) {
          alert(error.response.data.error);
          return;
        }
      }
    };
  }
  var viewmodel = new LoginViewModel();
  ko.applyBindings(viewmodel, document.getElementById("content"));
})();
