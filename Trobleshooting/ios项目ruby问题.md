这个错误信息说明你的 **React Native 创建项目时在安装 CocoaPods（Ruby 依赖）阶段失败了**，原因是你的 **Ruby 版本太低**。
我们来逐步分析并解决 👇

---

### 💥 错误核心

```
error securerandom-0.4.1 requires ruby version >= 3.1.0, which is incompatible with
the current version, ruby 2.7.6p219
```

也就是说：

* 当前系统的 Ruby 版本是 **2.7.6**
* 但 `securerandom-0.4.1`（CocoaPods 的依赖）需要 **Ruby ≥ 3.1.0**
* 所以安装失败，导致 `CocoaPods` 没装上。

---

### ✅ 解决步骤

#### 1. 检查当前 Ruby 版本

在终端执行：

```bash
ruby -v
```

如果输出类似：

```
ruby 2.7.6p219
```

就说明确实是旧版本。

---

#### 2. 升级 Ruby（推荐用 rbenv 或 Homebrew）

##### 方案 A：使用 **rbenv**

👉 推荐方式（不影响系统 Ruby）

```bash
brew install rbenv ruby-build
rbenv install 3.3.0    # 或者 3.2.x 也行
rbenv global 3.3.0
```

然后刷新环境：

```bash
exec "$SHELL"
ruby -v   # 验证版本已更新
```

##### 方案 B：使用 **Homebrew 直接安装 Ruby**

```bash
brew install ruby
```

然后把新 Ruby 加入 PATH（非常重要）：

```bash
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
ruby -v
```

---

#### 3. 安装 CocoaPods

Ruby 升级完之后重新安装 CocoaPods：

```bash
sudo gem install cocoapods
```

验证安装是否成功：

```bash
pod --version
```

---

#### 4. 回到 React Native 项目

重新进入你的项目目录，然后执行：

```bash
cd ios
pod install
```

如果能顺利安装依赖，说明环境已经正常。

---

### ⚠️ 提示

即使初始化时 CocoaPods 安装失败，React Native 项目本身仍然可以创建成功（只影响 iOS 运行）。
你仍然可以先运行 Android：

```bash
npx react-native run-android
```

等环境修好后再运行 iOS。

---

### ✅ 总结

| 问题              | 原因                      | 解决方案               |
| --------------- | ----------------------- | ------------------ |
| Ruby 版本太旧       | CocoaPods 依赖 Ruby ≥ 3.1 | 升级 Ruby 到 3.1+     |
| 安装 CocoaPods 失败 | Ruby 版本不兼容              | 重新安装 CocoaPods     |
| iOS 环境未就绪       | 缺少 Pods                 | 手动执行 `pod install` |

---

如果你告诉我你的 macOS 版本（例如 Sonoma、Monterey 等），我可以给你提供**最兼容的 Ruby 安装命令和路径配置方式**。
要我帮你针对你的 macOS 版本写一下完整命令吗？
