import React, { Component } from 'react';

const AsyncComponent = (importComponent: () => Promise<any>) => {
  return class extends Component<any, { component: React.ReactType }> {
    componentDidMount() {
      importComponent()
        .then((components: any) => {
          this.setState({
            component: components.default ? components.default : '',
          });
        })
        .catch((e: any) => console.error(e));
    }

    render() {
      if (this.state && this.state.component) {
        const C = this.state.component as React.ReactType;
        return C ? <C {...this.props} /> : null;
      }
      return null;
    }
  };
};

export default AsyncComponent;
