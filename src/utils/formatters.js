/**
 * Creates a nested object where the nesting keys follow the paths
 * analogous to the dotted syntax provided in the hook.
 *
 * For example, if hook is 'top.second.third' then resulting nest will
 * appear as: { top: { second: { third: {} } } }
 * Note that the deepest items are empty objects.
 *
 * @param hook String
 *   The hook to transform to a nested object.
 *
 * @param nest Object
 *   It's suggested to pass an empty object initialised from the calling
 *   function. nest will be altered through running this function.
 *
 * @returns Object
 */
const compileNestFromDotSeparated = function (hook, nest) {
  if (hook.indexOf('.') !== -1) {
    hook = hook.split('.')
    let shifted = hook.shift()

    if (!nest.hasOwnProperty(shifted)) {
      nest[shifted] = {}
    }

    nest[shifted] = compileNestFromDotSeparated(hook.join('.'), nest[shifted])
  } else {
    nest[hook] = {}
  }

  return nest
}

/**
 * Pretty-prints an indented list based on a nest generated by compileNestFromDotSeparated()
 *
 * @see compileNestFromDotSeparated()
 *
 * @param nest
 *   The nested object of keys to be used in the indented list.
 *
 * @param indentSize
 *   The number of spaces used for each indent.
 *
 * @param _level
 *   (Internal) for tracking current indent.
 *
 * @returns String
 */
const formatNestedObjectKeys = function (nest, indentSize = 2, _level = 0) {
  const { _ } = DI.container

  let output = ''

  _(nest).forEach((item, key) => {
    let indent = ''

    _.times(_level * indentSize, () => {
      indent += ' '
    })

    output += `\n${indent} - ${key}`

    if (!_.isEmpty(item)) {
      let increasedLevel = _level + 1
      output += formatNestedObjectKeys(item, indentSize, increasedLevel)
    }
  })

  return output
}

export {
  compileNestFromDotSeparated,
  formatNestedObjectKeys
}
