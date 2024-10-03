'use client'

import { useState } from 'react'
import { Keypair } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyIcon, CheckIcon } from 'lucide-react'
import bs58 from 'bs58'

export function WalletGenerator() {
  const [walletCount, setWalletCount] = useState(1)
  const [wallets, setWallets] = useState<{ publicKey: string; privateKey: string }[]>([])
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedPrivate, setCopiedPrivate] = useState(false)

  const generateWallets = () => {
    const newWallets = Array.from({ length: walletCount }, () => {
      const keypair = Keypair.generate()
      return {
        publicKey: keypair.publicKey.toString(),
        privateKey: bs58.encode(keypair.secretKey)
      }
    })
    setWallets(newWallets)
  }

  const copyKeys = (type: 'public' | 'private') => {
    const keys = wallets.map(wallet => wallet[type === 'public' ? 'publicKey' : 'privateKey']).join('\n')
    navigator.clipboard.writeText(keys)
    if (type === 'public') {
      setCopiedPublic(true)
      setTimeout(() => setCopiedPublic(false), 2000)
    } else {
      setCopiedPrivate(true)
      setTimeout(() => setCopiedPrivate(false), 2000)
    }
  }

  return (
    <div className="mt-[20%]">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Solana Wallet Generator</CardTitle>
          <CardDescription>Generate multiple Solana wallets and copy their keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="walletCount">Number of wallets to generate</Label>
              <Input
                id="walletCount"
                type="number"
                min="1"
                value={walletCount}
                onChange={(e) => setWalletCount(parseInt(e.target.value))}
              />
            </div>
            <Button onClick={generateWallets}>Generate Wallets</Button>
            
            {wallets.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Public Keys</h3>
                  <div className="bg-muted p-2 rounded-md">
                    {wallets.map((wallet, index) => (
                      <div key={index} className="mb-1">{wallet.publicKey}</div>
                    ))}
                  </div>
                  <Button className="mt-2" onClick={() => copyKeys('public')}>
                    {copiedPublic ? <CheckIcon className="mr-2 h-4 w-4" /> : <CopyIcon className="mr-2 h-4 w-4" />}
                    {copiedPublic ? 'Copied!' : 'Copy Public Keys'}
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Private Keys</h3>
                  <div className="bg-muted p-2 rounded-md relative">
                    {wallets.map((_, index) => (
                      <div key={index} className="mb-1 font-mono text-sm">
                        {'•'.repeat(64)}
                      </div>
                    ))}
                  </div>
                  <Button className="mt-2" onClick={() => copyKeys('private')}>
                    {copiedPrivate ? <CheckIcon className="mr-2 h-4 w-4" /> : <CopyIcon className="mr-2 h-4 w-4" />}
                    {copiedPrivate ? 'Copied!' : 'Copy Private Keys'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}