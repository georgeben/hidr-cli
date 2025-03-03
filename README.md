

# Hidr - Secure Secret Sharing CLI

Hidr is a CLI tool for securely sharing secrets and credentials (sensitive data). It encrypts secrets using AES-256-GCM, ensuring that the encryption key never leaves your device. Secrets can be shared with a TTL (time-to-live) and a read limit, making it ideal for one-time or temporary secret sharing.

## Features
- Secure encryption using AES-256-GCM
- Share secrets as text or from a file
- Set expiration (TTL) for secrets
- Limit the number of times a secret can be viewed
- Share secrets that can only be viewed by a specific user

## Installation

You can use Hidr without installation via `npx`:

```sh
npx hidr <command>
```

Or install it globally:

```sh
npm install -g hidr
```
Once installed, simply run `hidr <command>`


## Usage

### Sharing Secrets

To share a secret directly:

```sh
npx hidr share "my-secret-password"
```

To share a secret from a file:

```sh
npx hidr share -f path/to/secret.env
```

You can also set a time-to-live (TTL) and a read limit:

```sh
npx hidr share "my-secret" -t 2h -l 3
```

- `-t, --ttl <ttl>`: Defines when the secret expires, after which it cannot be viewed. (e.g., `1m`, `2h`, `1d`). Default is 7 days.
- `-l, --limit <count>`: Defines the number of times the secret can be viewed.

After running a share command, Hidr will display a command to retrieve the secret.

### Viewing Secrets

To view a secret:

```sh
npx hidr view <secret-id>
```

To save the secret to a file:

```sh
npx hidr view <secret-id> -o output.txt
```

### Sharing secrets with a specific user/device

First, create an identifier on the device that will view the secrets by running:

```sh
npx hidr init <user-id>
```

`<user-id>` is a unique identifier for a device. It can be any string e.g "georgeben-mbp", "website.com".

The init command generates a key pair for your device, allowing others to share secrets only your device can view.


To share a secret with a specific user, add the -u flag:

```sh
npx hidr share "secret-api-key" -t 1h -l 1 -u <user-id>
```

This will generate a secret that can only be viewed by the user with the given `<user-id>`.

## Examples

### Share a secret with a 1-hour expiration that can only be viewed once

```sh
npx hidr share "super-secure-code" -t 1h -l 1
```

Output:

```sh
To view this secret, run:
npx hidr view abc123def456
```

### Retrieve the secret:

```sh
npx hidr view abc123def456
```

Output:

```sh
super-secure-code
Remaining reads: 0
```

## Security
This tool is built for privacy and security.
- **Local Encryption:** Secrets are encrypted locally on your device using AES-256-GCM.
- **Private:** The encryption key never leaves your device

## License
MIT

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

