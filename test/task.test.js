const Task = require('../libs/task');

const task = new Task();

test('should init mode default parallel', () => {
  expect(task.props.mode).toBe('parallel');
});

test('should set mode to series', () => {
  task.mode(true);
  expect(task.props.mode).toBe('series');
});

test('set context', () => {
  const ctx = {ctx: true};
  task.context(ctx);
  expect(task.props.context).toBe(ctx);
});

test('should get null when not any tasks', async () => {
  await expect(task.run(result => {})).toBeNull();
});

test('should get right value', async () => {
  task.add(callback => {
    setTimeout(() => {
      callback(null, {a:1});
    }, 16);
  })
  await expect(task.run(result => {})).resolves.toContainEqual({a:1});
});

test('should handle error right', async () => {
  task.add(callback => {
    callback(new Error('handle error'), null);
  });

  await expect(task.run(result => {})).rejects.toThrow('handle error');
});
