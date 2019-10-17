import { is, fromJS } from 'immutable';
const ReactMixin = {
  shouldComponentUpdate(nextProps: any, nextState: any) {
    const _currentProps = this.props || {};
    const _currntState = this.state || {};
    // console.log('%c this---->', "font-weight:600;color:'#333'", this.props);
    // console.log('next---->', nextProps);
    if (
      (nextProps &&
        Object.keys(_currentProps).length !== Object.keys(nextProps).length) ||
      (nextState &&
        Object.keys(_currntState).length !== Object.keys(nextState).length)
    ) {
      return true;
    }

    for (const key in nextProps) {
      if (!is(fromJS(_currentProps[key]), fromJS(nextProps[key]))) {
        return true;
      }
    }

    for (const key in nextState) {
      if (
        _currntState[key] !== nextState[key] ||
        !is(fromJS(_currntState[key]), fromJS(nextState[key]))
      ) {
        return true;
      }
    }
    return false;
  },
};

function LifeCircle(target: any) {
  const targetSCU = target.prototype.shouldComponentUpdate;
  target.prototype.shouldComponentUpdate = targetSCU
    ? targetSCU
    : ReactMixin.shouldComponentUpdate;
  return target;
}
export default LifeCircle;
