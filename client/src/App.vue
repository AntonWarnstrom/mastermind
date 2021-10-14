<template>
  <router-view />
</template>

<style lang="scss">
body,
html {
  background: var(--white);
  height: 100%;
  margin: 0;
  color: var(--primary-text);
  font-variant-numeric: tabular-nums 0;
}
body,
* {
  font-family: "Cerebri Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*,
::after,
::before {
  box-sizing: border-box;
}
* {
  outline: none;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-color) var(--scrollbar-background);
}
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  background: var(--scrollbar-background);
}

*::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color);
  border-radius: 20px;
  border: none;
}
#app {
  height: 100%;
}

.card {
  background-color: var(--primary-card-background);
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  background-clip: border-box;
  border: 1px solid var(--border-color);
  border-radius: 10px;
}
.card-title {
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 0.75rem 1.5rem 0 1.5rem;
}
.card-body {
  flex: 1 1 auto;
  padding: 1.5rem;
}
.card-footer {
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
button {
  font-weight: bold;
  background-color: var(--primary-button);
  color: white;
  padding: 12px;
  border-radius: 6px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  &.secondary {
    background-color: var(--secondary-button);
    &:hover {
      background-color: var(--secondary-button-hover);
    }
  }
  &:hover {
    background-color: var(--primary-button-hover);
    border: none;
    color: white;
  }
}
:root {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 16px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

html {
  --secondary-button: #8b928f;
  --secondary-button-hover: #808885;
  --primary-button: #157548;
  --primary-button-hover: #15633e;
  --primary-background: #e6e6ea;
  --primary-card-background: #fcfcfc;
  --border-color: #dbdbdb;
  --hover-leaderboard: #dbdbdb;
  --odd-leaderboard: #f2f2f2;
  --dark: #12263f;
  --primary-text: #031b4e;
}
</style>
