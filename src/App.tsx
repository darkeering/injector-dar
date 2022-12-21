import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "reflect-metadata";
import { Subject } from "rxjs";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

function Injectable() {
  return function (tar: any) {
    Reflect.defineMetadata("dar_service", true, tar);
  };
}

function Component({ components, providers }: any) {
  return function (tar: any) {
    Reflect.defineMetadata("dar_component", true, tar);
    if (components && components.length > 0) {
      Reflect.defineMetadata("children", components, tar);
    }
    if (providers && providers.length > 0) {
      Reflect.defineMetadata("ownProviders", providers, tar);
    }
  };
}

function Module({ declares, providers }: any) {
  return function (tar: any) {
    Reflect.defineMetadata("declares", declares, tar);
    Reflect.defineMetadata("providers", providers, tar);
  };
}

@Injectable()
class UserService {
  name = "dar";
  age = 18;
  name$ = new Subject();
}
@Injectable()
class ManagementService {
  manageId = 111111;
  change$ = new Subject();
}

@Component({})
class NameComponent {
  userService: UserService;
  managementService: ManagementService;
  constructor(userService: UserService, managementService: ManagementService) {
    this.userService = userService;
    this.managementService = managementService;

    this.managementService.change$.subscribe(() => this.print());
  }

  print() {
    console.log("name", this.userService.name);
  }
}

@Component({})
class AgeComponent {
  userService: UserService;
  managementService: ManagementService;
  constructor(userService: UserService, managementService: ManagementService) {
    this.userService = userService;
    this.managementService = managementService;

    this.managementService.change$.subscribe(() => this.print());
  }

  print() {
    console.log("age", this.userService.age);
  }
}

@Component({
  components: [NameComponent, AgeComponent],
  providers: [UserService],
})
class UserComponent {
  userService: UserService;
  managementService: ManagementService;
  constructor(userService: UserService, managementService: ManagementService) {
    this.userService = userService;
    this.managementService = managementService;
  }

  change() {
    this.userService.name = "darkeering";
    this.userService.age = 19;
    this.managementService.change$.next("");
  }
}
@Component({
  components: [UserComponent, UserComponent],
  providers: [ManagementService],
})
class Management {
  managementService: ManagementService;
  constructor(managementService: ManagementService) {
    this.managementService = managementService;
    this.managementService.change$.subscribe(() => this.print());
  }

  init() {
    this.managementService.change$.next("");
  }

  print() {
    console.log("manageId", this.managementService.manageId);
  }

  change() {
    this.managementService.manageId = 222222;
    this.managementService.change$.next("");
  }
}

@Module({
  providers: [UserService, ManagementService],
})
class UserModule {}

class Factory {
  providers: any = {};
  createModule(module: any) {
    const providers = Reflect.getMetadata("providers", module);
    providers.forEach((provider: any) => {
      this.providers[provider.name] ||
        (this.providers[provider.name] = new provider());
    });
  }

  createComponent(component: any, factory: any) {
    const paramtypes = Reflect.getMetadata("design:paramtypes", component);
    const ownProviders = Reflect.getMetadata("ownProviders", component);
    const ownFactory = new Factory();
    ownFactory.providers = { ...factory.providers };
    if (ownProviders) {
      ownProviders.forEach((ownProvider: any) => {
        if (ownFactory.providers[ownProvider.name]) {
          ownFactory.providers[ownProvider.name] = new ownProvider();
        }
      });
    }
    const args = paramtypes.map((paramtype: any) => {
      return ownFactory.providers[paramtype.name];
    });
    const _this = new component(...args);
    const children = Reflect.getMetadata("children", component);
    if (children) {
      _this["children"] = children.map((child: any) =>
        factory.createComponent(child, ownFactory)
      );
    }
    return _this;
  }
}

const app = new Factory();
app.createModule(UserModule);
const compTree = app.createComponent(Management, app);
console.log("初始");
compTree.init();

console.log("");
console.log("修改user1");
compTree.children[0].change();

console.log("");
console.log("修改user2");
compTree.children[1].change();

console.log("");
console.log("修改Id");
compTree.change();
