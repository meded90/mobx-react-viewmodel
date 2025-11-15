import React, { useState } from 'react';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { useViewModelFactory } from '../src/useViewModel';
import { ViewModel } from '../src';

export default {
  title: 'useViewModelFactory',
  parameters: {
    docs: {
      description: {
        component: `Advanced hook for creating stateful view-model instance manualy. You can pass custom arguments to the view-model constructor.
          It might be useful for Dependency Injection.`,
      },
    },
  },
};

/// ------------------------------------------
// Example of view-модели with Dependency Injection
//
type User = {
  id: string;
  name: string;
};
class UsersStore {
  private users: Record<string, User> = {
    'user-1-id': {
      id: 'user-1-id',
      name: 'user-1-name',
    },
  };

  getUser(id: string): User | undefined {
    return this.users[id];
  }
}
const userStore = new UsersStore();

interface AdvancedDIViewModelProps {
  userId: string;
}
class AdvancedDIViewModel {
  @observable.ref
  props: AdvancedDIViewModelProps;

  private usersStore: UsersStore;

  constructor(props: AdvancedDIViewModelProps, usersStore: UsersStore) {
    makeObservable(this);
    this.props = props;
    this.usersStore = usersStore;
  }

  @computed
  get user() {
    return this.usersStore.getUser(this.props.userId);
  }
}

const AdvancedDIExample = observer(function AdvancedDIExample$() {
  // Pass userStore to view-model via factory-hook
  const viewModel = useViewModelFactory(
    props => new AdvancedDIViewModel(props, userStore),
    { userId: 'user-1-id' }
  );

  return (
    <div>
      <p>User from UsersStore: </p>
      <pre>{viewModel.user ? JSON.stringify(viewModel.user) : '-'}</pre>
    </div>
  );
});

export const WithDependencyInjection = () => {
  return <AdvancedDIExample />;
};
WithDependencyInjection.parameters = {
  controls: { expanded: true },
  docs: {
    source: {
      code: `
type User = {
  id: string;
  name: string;
};
class UsersStore {
  private users: Record<string, User> = {
    'user-1-id': {
      id: 'user-1-id',
      name: 'user-1-name',
    },
  };

  getUser(id: string): User | undefined {
    return this.users[id];
  }
}
const userStore = new UsersStore();

interface AdvancedDIViewModelProps {
  userId: string;
}
class AdvancedDIViewModel {
  @observable.ref
  props: AdvancedDIViewModelProps;

  private usersStore: UsersStore;

  constructor(props: AdvancedDIViewModelProps, usersStore: UsersStore) {
    makeObservable(this);
    this.props = props;
    this.usersStore = usersStore;
  }

  @computed
  get user() {
    return this.usersStore.getUser(this.props.userId);
  }
}

const AdvancedDIExample = observer(function AdvancedDIExample$() {
  // Pass userStore to view-model via factory-hook
  const viewModel = useViewModelFactory(
    props => new AdvancedDIViewModel(props, userStore),
    { userId: 'user-1-id' }
  );

  return (
    <div>
      <p>User from UsersStore: </p>
      <pre>{viewModel.user ? JSON.stringify(viewModel.user) : '-'}</pre>
    </div>
  );
});
      `,
      language: 'jsx',
      type: 'auto',
    },
  },
};



/// ------------------------------------------
// Example of view-model with optional props
//
interface OptionalPropsExample {
  userId?: string;
  title: string | undefined;
  subTitle?: string;

}

class OptionalPropsViewModel extends ViewModel<OptionalPropsExample> {
  constructor(props: OptionalPropsExample) {
    super(props);
  }

  @computed
  get displayText() {
    const user = this.props.userId || 'Guest';
    const title = this.props.title || 'Untitled';
    return `${title} by ${user}`;
  }
}

const OptionalPropsComponent = observer(
  (props: {
    userId: string | undefined
    title?: string
    subTitle?: string;

  }) => {
    const viewModel = useViewModelFactory((p: OptionalPropsExample) => new OptionalPropsViewModel(p), {
      userId: props.userId,
      title: props.title,
      subTitle: props.subTitle
    });

    return (
      <div>
        <p>{viewModel.displayText}</p>
      </div>
    );
  }
);

export const WithOptionalProps = () => {
  const [userId, setUserId] = useState<string>('user-123');
  const [title, setTitle] = useState<string>('My Article');

  return (
    <>
      <div>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter user ID..."
          />
        </label>
      </div>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter title..."
          />
        </label>
      </div>
      <OptionalPropsComponent userId={userId} title={title} />
    </>
  );
};

WithOptionalProps.parameters = {
  docs: {
    source: {
      code: `
interface OptionalPropsExample {
  userId?: string;
  title: string | undefined;
  subTitle?: string;
}

class OptionalPropsViewModel extends ViewModel<OptionalPropsExample> {
  constructor(props: OptionalPropsExample) {
    super(props);
  }

  @computed
  get displayText() {
    const user = this.props.userId || 'Guest';
    const title = this.props.title || 'Untitled';
    return \`\${title} by \${user}\`;
  }
}

const OptionalPropsComponent = observer(
  (props: {
    userId: string | undefined
    title?: string
    subTitle?: string;
  }) => {
    const viewModel = useViewModelFactory((p: OptionalPropsExample) => new OptionalPropsViewModel(p), {
      userId: props.userId,
      title: props.title,
      subTitle: props.subTitle
    });

    return (
      <div>
        <p>{viewModel.displayText}</p>
      </div>
    );
  }
);
      `,
      language: 'jsx',
      type: 'auto',
    },
  },
};
