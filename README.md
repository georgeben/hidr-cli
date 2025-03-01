

# Hidr - Secure Secret Sharing CLI

Hidr is a CLI tool for securely sharing secrets and credentials. It encrypts secrets using AES-256-GCM, ensuring that the encryption key never leaves your device. Secrets can be shared with a TTL (time-to-live) and a read limit, making it ideal for one-time or temporary secret sharing.

## Features
- Secure encryption using AES-256-GCM
- Share secrets as text or from a file
- Set expiration (TTL) for secrets
- Limit the number of times a secret can be accessed

## Installation

You can use Hidr without installation via `npx`:

```sh
npx hidr <command>
```

Or install it globally:

```sh
npm install -g hidr
```

## Usage

### Share a Secret

To share a secret directly:

```sh
npx hidr share "my-secret-password"
```

To share a secret from a file:

```sh
npx hidr share -f path/to/secret.txt
```

You can also set a time-to-live (TTL) and a read limit:

```sh
npx hidr share "my-secret" -t 2h -l 3
```

- `-t, --ttl <ttl>`: Time-to-live for the secret (e.g., `1m`, `2h`, `1d`)
- `-l, --limit <count>`: Maximum number of times the secret can be read

Upon sharing, Hidr will provide a command to retrieve the secret.

### Retrieve a Secret

To view a secret:

```sh
npx hidr view <secret-id>
```

To save the secret to a file:

```sh
npx hidr view <secret-id> -o output.txt
```

## Example

```sh
npx hidr share "super-secure-code" -t 1h -l 1
```

Output:

```sh
To view this secret, run:
npx hidr view <generated-secret-id>
```

Then retrieve the secret:

```sh
npx hidr view <generated-secret-id>
```

## Security
- Secrets are encrypted locally using AES-256-GCM.
- The encryption key never leaves your device.
- The secret is securely stored until it expires or is retrieved.

## License
MIT

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

