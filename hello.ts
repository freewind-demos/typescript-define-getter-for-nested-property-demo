function isConfigurable(obj: any, propertyName: string): boolean {
  const property = Object.getOwnPropertyDescriptor(obj, propertyName)
  if (property === undefined || property.configurable === undefined) {
    return true;
  } else {
    return property.configurable
  }
}

function defineProperty(obj: any, propertyPath: string[], getter: (value: any) => any): void {
  const isLast = propertyPath.length === 1;

  const [propertyName, ...rest] = propertyPath;

  let value = obj[propertyName] || {};

  if (isConfigurable(obj, propertyName)) {
    Object.defineProperty(obj, propertyName, {
      get() {
        if (isLast) {
          return getter(value);
        } else {
          defineProperty(value, rest, getter);
          return value;
        }
      },
      set(newValue) {
        value = newValue || {};
      },
      configurable: false
    });
  }
}

type User = {
  city: {
    address: {
      home: string
    }
  }
}

const user: User = {} as User;

defineProperty(user, ['city', 'address', 'home'], (home) => `[[${home}]]`)

user.city.address.home = 'my-home1';
console.log(user.city.address.home);

user.city.address = {
  home: 'my-home2'
}
console.log(user.city.address.home);

user.city = {
  address: {
    home: 'my-home3'
  }
}
console.log(user.city.address.home);

